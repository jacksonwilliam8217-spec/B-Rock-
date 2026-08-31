export default function CryptoTicker() {
  return (
    <div
      className="w-full"
      style={{
        height: "62px",
        backgroundColor: "#1B2030",
        overflow: "hidden",
        boxSizing: "border-box",
        border: "1px solid #56667F",
        borderRadius: "4px",
        textAlign: "right",
        lineHeight: "14px",
        fontSize: "12px",
        boxShadow: "inset 0 -20px 0 0 #56667F",
        padding: 0,
        margin: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "42px",
          padding: 0,
          margin: 0,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <iframe
          src="https://coinlib.io/widget?type=horizontal_v2&theme=dark&pref_coin_id=1505&invert_hover="
          width="100%"
          height="42"
          scrolling="no"
          marginWidth={0}
          marginHeight={0}
          frameBorder="0"
          style={{
            border: 0,
            margin: 0,
            padding: 0,
            pointerEvents: "none",
          }}
          title="Cryptocurrency Prices"
        />
      </div>

      <div
        style={{
          color: "#FFFFFF",
          lineHeight: "14px",
          fontWeight: 400,
          fontSize: "11px",
          boxSizing: "border-box",
          padding: "2px 6px",
          width: "100%",
          fontFamily: "Verdana, Tahoma, Arial, sans-serif",
          pointerEvents: "none",
        }}
      >
        Cryptocurrency Prices by Coinlib
      </div>
    </div>
  );
}
