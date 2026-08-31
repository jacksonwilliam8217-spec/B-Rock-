import { NextResponse } from "next/server";

const TOKENS: Record<string, { symbol: string; decimals: number }> = {
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    symbol: "USDT",
    decimals: 6,
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    symbol: "USDC",
    decimals: 6,
  },
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
    symbol: "WETH",
    decimals: 18,
  },
};

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a9df523b3ef";

type RpcResponse<T> = {
  result?: T;
  error?: { message?: string };
};

type Log = {
  address: string;
  topics: string[];
  data: string;
  blockNumber: string;
  transactionHash: string;
  logIndex: string;
};

async function rpc<T>(method: string, params: unknown[]) {
  const key = process.env.ALCHEMY_API_KEY;

  if (!key) {
    throw new Error("ALCHEMY_API_KEY is not configured");
  }

  const response = await fetch(
    `https://eth-mainnet.g.alchemy.com/v2/${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
      cache: "no-store",
    }
  );

  const json = (await response.json()) as RpcResponse<T>;

  if (!response.ok || json.error) {
    throw new Error(json.error?.message || "Ethereum RPC request failed");
  }

  return json.result as T;
}

function addressFromTopic(topic: string) {
  return `0x${topic.slice(-40)}`;
}

function formatAmount(raw: string, decimals: number) {
  const value = BigInt(raw);
  const base = BigInt(10) ** BigInt(decimals);
  const whole = value / base;
  const fraction = value % base;

  if (fraction === BigInt(0)) {
    return whole.toLocaleString("en-US");
  }

  const fractionText = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return `${whole.toLocaleString("en-US")}.${fractionText}`;
}

export async function GET() {
  try {
    const latestHex = await rpc<string>("eth_blockNumber", []);
    const latest = parseInt(latestHex, 16);

    // Roughly the most recent few hours on Ethereum.
    // Keeping the range limited avoids oversized RPC requests.
    const fromBlock = Math.max(0, latest - 1000);

    const logs = await rpc<Log[]>("eth_getLogs", [
      {
        address: Object.keys(TOKENS),
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: latestHex,
        topics: [TRANSFER_TOPIC],
      },
    ]);

    const recentLogs = logs
      .sort((a, b) => {
        const blockDifference =
          parseInt(b.blockNumber, 16) - parseInt(a.blockNumber, 16);

        if (blockDifference !== 0) return blockDifference;

        return parseInt(b.logIndex, 16) - parseInt(a.logIndex, 16);
      })
      .slice(0, 20);

    const blockNumbers = [
      ...new Set(recentLogs.map((log) => log.blockNumber)),
    ];

    const blockResults = await Promise.all(
      blockNumbers.map(async (blockNumber) => {
        const block = await rpc<{ timestamp: string }>(
          "eth_getBlockByNumber",
          [blockNumber, false]
        );

        return [blockNumber, parseInt(block.timestamp, 16)] as const;
      })
    );

    const timestamps = new Map(blockResults);

    const activity = recentLogs.map((log) => {
      const token =
        TOKENS[log.address.toLowerCase()] || {
          symbol: "TOKEN",
          decimals: 18,
        };

      return {
        type: "Transfer",
        asset: token.symbol,
        amount: formatAmount(log.data, token.decimals),
        from: addressFromTopic(log.topics[1]),
        to: addressFromTopic(log.topics[2]),
        transactionHash: log.transactionHash,
        blockNumber: parseInt(log.blockNumber, 16),
        timestamp: timestamps.get(log.blockNumber) ?? null,
        network: "Ethereum",
      };
    });

    return NextResponse.json(
      {
        network: "Ethereum Mainnet",
        activity,
        updatedAt: Date.now(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Live blockchain activity error:", error);

    return NextResponse.json(
      {
        network: "Ethereum Mainnet",
        activity: [],
        error: "Live blockchain activity is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
