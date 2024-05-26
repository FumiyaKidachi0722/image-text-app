import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (imageRef.current) {
      html2canvas(imageRef.current.parentElement as HTMLElement).then(
        (canvas) => {
          const link = downloadRef.current;
          if (link) {
            link.href = canvas.toDataURL("image/png");
            link.download = "cheki.png";
            link.click();
          }
        }
      );
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "'Yomogi', sans-serif" }}>
      <h1 style={{ color: "#ff69b4" }}>応援メッセージを書こう！</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />
      <input
        type="text"
        placeholder="応援メッセージを入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          margin: "10px 0",
          padding: "10px",
          borderRadius: "10px",
          border: "2px solid #ff69b4",
        }}
      />
      <br />
      {image && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            ref={imageRef}
            src={image}
            alt="uploaded"
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              borderRadius: "10px",
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              color: "#fff",
              backgroundColor: "transparent",
              padding: "5px 10px",
              borderRadius: "10px",
              fontFamily: "'Yomogi', sans-serif",
              fontSize: "24px",
              textShadow: `
                2px 2px 0 #ff69b4, 
                -2px 2px 0 #ff69b4, 
                2px -2px 0 #ff69b4, 
                -2px -2px 0 #ff69b4,
                2px 0 0 #ff69b4,
                -2px 0 0 #ff69b4,
                0 2px 0 #ff69b4,
                0 -2px 0 #ff69b4`, // ピンクの影を追加
              whiteSpace: "pre-wrap",
            }}
          >
            {text}
          </span>
        </div>
      )}
      <br />
      <button
        onClick={handleDownload}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#ff69b4",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ダウンロード
      </button>
      <a ref={downloadRef} style={{ display: "none" }}>
        Download
      </a>
    </div>
  );
};

export default Home;
