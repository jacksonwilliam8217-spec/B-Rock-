import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const ALCHEMY_URL = ALCHEMY_API_KEY
  ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
  : null;

const TOKEN_CONTRACTS: Record<string, string> = {
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  USDC: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};

const TOKEN_DECIMALS: Record<string, number> = {
  USDT: 6,
  USDC: 6,
  WETH: 18,
};

type AssetTransfer = {
  hash?: string;
  from?: string;
  to?: string;
  value?: number;
  rawContract?: {
    address?: string;
    decimals?: number;
  };
};

async function alchemyRpc(
  method: string,
  params: unknown[]
): Promise<unknown> {
  if (!ALCHEMY_URL) {
    throw new Error("ALCHEMY_API_KEY is not configured.");
  }

  const response = await fetch(ALCHEMY_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Alchemy returned HTTP ${response.status}.`);
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(json.error.message || "Alchemy request failed.");
  }

  return json.result;
}

function normaliseAddress(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

function getTokenContract(asset: string) {
  return TOKEN_CONTRACTS[asset.toUpperCase()];
}

function getTokenDecimals(asset: string) {
  return TOKEN_DECIMALS[asset.toUpperCase()] ?? 18;
}

function formatTokenAmount(rawValue: string, decimals: number) {
  const value = BigInt(rawValue);
  const divisor = 10n ** BigInt(decimals);
  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === 0n) {
    return Number(whole);
  }

  const fractionText = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return Number(`${whole}.${fractionText}`);
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const depositId = String(body?.deposit_id || "").trim();

    if (!depositId) {
      return NextResponse.json(
        { error: "deposit_id is required." },
        { status: 400 }
      );
    }

    /*
     * Only look at the user's own pending deposit.
     */
    const { data: deposit, error: depositError } = await supabase
      .from("deposits")
      .select(
        "id, user_id, investment_id, amount, status, crypto_asset, blockchain, payment_method_id, transaction_reference"
      )
      .eq("id", depositId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (depositError) {
      return NextResponse.json(
        { error: depositError.message },
        { status: 500 }
      );
    }

    if (!deposit) {
      return NextResponse.json(
        { error: "Deposit not found." },
        { status: 404 }
      );
    }

    if (deposit.status === "verified") {
      return NextResponse.json({
        verified: true,
        message: "This deposit has already been verified.",
        transaction_reference: deposit.transaction_reference,
      });
    }

    if (deposit.status !== "pending") {
      return NextResponse.json(
        {
          verified: false,
          message: `Deposit status is ${deposit.status}.`,
        },
        { status: 400 }
      );
    }

    /*
     * Get the payment method that the pending deposit was created for.
     */
    if (!deposit.payment_method_id) {
      return NextResponse.json(
        {
          error:
            "This deposit is not associated with a crypto payment method.",
        },
        { status: 400 }
      );
    }

    const { data: method, error: methodError } = await supabase
      .from("payment_methods")
      .select(
        "id, name, type, asset, network, wallet_address, min_amount, max_amount, confirmation_required, is_active"
      )
      .eq("id", deposit.payment_method_id)
      .maybeSingle();

    if (methodError) {
      return NextResponse.json(
        { error: methodError.message },
        { status: 500 }
      );
    }

    if (!method || !method.is_active) {
      return NextResponse.json(
        { error: "The selected payment method is no longer active." },
        { status: 400 }
      );
    }

    if (
      method.type !== "crypto" ||
      method.network !== "ERC20" ||
      !method.asset ||
      !method.wallet_address
    ) {
      return NextResponse.json(
        {
          error:
            "This automatic checker currently supports Ethereum ERC20 assets only.",
        },
        { status: 400 }
      );
    }

    const asset = method.asset.toUpperCase();
    const contractAddress = getTokenContract(asset);

    if (!contractAddress) {
      return NextResponse.json(
        { error: `Unsupported automatic asset: ${asset}` },
        { status: 400 }
      );
    }

    const receivingAddress = normaliseAddress(method.wallet_address);

    if (!/^0x[a-f0-9]{40}$/.test(receivingAddress)) {
      return NextResponse.json(
        { error: "The B-Rock receiving address is invalid." },
        { status: 500 }
      );
    }

    /*
     * Query recent ERC20 transfers into the configured
     * B-Rock receiving address.
     */
    const result = (await alchemyRpc("alchemy_getAssetTransfers", [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        toAddress: receivingAddress,
        contractAddresses: [contractAddress],
        category: ["erc20"],
        order: "desc",
        maxCount: "0x64",
        withMetadata: false,
      },
    ])) as {
      transfers?: AssetTransfer[];
      pageKey?: string;
    };

    const transfers = result?.transfers || [];

    /*
     * Find the newest transfer that is large enough to satisfy
     * the user's requested deposit.
     */
    const matchingTransfer = transfers.find((transfer) => {
      if (!transfer.hash || !transfer.to || transfer.value == null) {
        return false;
      }

      if (
        normaliseAddress(transfer.to) !== receivingAddress
      ) {
        return false;
      }

      if (
        normaliseAddress(transfer.rawContract?.address) !==
        normaliseAddress(contractAddress)
      ) {
        return false;
      }

      return Number(transfer.value) >= Number(deposit.amount);
    });

    if (!matchingTransfer?.hash) {
      return NextResponse.json({
        verified: false,
        message:
          "No matching blockchain transfer has been detected yet.",
      });
    }

    const transactionReference = matchingTransfer.hash;

    /*
     * Check whether this transaction has already been processed.
     */
    const { data: existingDeposit } = await supabase
      .from("deposits")
      .select("id, user_id, status")
      .eq("transaction_reference", transactionReference)
      .maybeSingle();

    if (existingDeposit && existingDeposit.id !== deposit.id) {
      return NextResponse.json(
        {
          verified: false,
          error:
            "This blockchain transaction has already been associated with another deposit.",
        },
        { status: 409 }
      );
    }

    const decimals =
      matchingTransfer.rawContract?.decimals ??
      getTokenDecimals(asset);

    const blockchainAmount = Number(matchingTransfer.value);

    /*
     * Alchemy's normalized value is already human-readable.
     * For safety, fall back to rawContract data if necessary.
     */
    let verifiedAmount = blockchainAmount;

    if (
      !Number.isFinite(verifiedAmount) ||
      verifiedAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Unable to determine blockchain transfer amount." },
        { status: 500 }
      );
    }

    /*
     * Verify and activate the existing deposit/investment
     * through the database transaction function.
     */
    const { data: verificationResult, error: verificationError } =
      await supabase.rpc("verify_wallet_deposit", {
        p_deposit_id: deposit.id,
        p_transaction_reference: transactionReference,
        p_crypto_asset: asset,
        p_blockchain: "Ethereum",
        p_amount: verifiedAmount,
      });

    if (verificationError) {
      return NextResponse.json(
        {
          verified: false,
          error: verificationError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      deposit_id: verificationResult,
      transaction_reference: transactionReference,
      crypto_asset: asset,
      blockchain: "Ethereum",
      amount: verifiedAmount,
      decimals,
      message: "Blockchain deposit verified successfully.",
    });
  } catch (error) {
    console.error("wallet deposit check error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to check blockchain deposit.",
      },
      { status: 500 }
    );
  }
}
