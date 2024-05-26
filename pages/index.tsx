import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const Home = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
    if (canvasRef.current) {
      html2canvas(canvasRef.current).then((canvas) => {
        const link = downloadRef.current;
        if (link) {
          link.href = canvas.toDataURL("image/png");
          link.download = "cheki.png";
          link.click();
        }
      });
    }
  };

  const getRandomOffset = (max: number) => Math.random() * max - max / 2;
  const getRandomRotation = (max: number) =>
    (Math.random() * max - max / 2) * (Math.PI / 180);

  /**
   * ランダムなずれと回転を持つ文字を描画する
   * @param ctx キャンバスのコンテキスト
   * @param text 描画するテキスト
   * @param x x座標
   * @param y y座標
   */
  const drawTextWithRandomDisplacement = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number
  ) => {
    ctx.save();
    const fontSize = 24;
    const font = "24px 'Yomogi', sans-serif";
    ctx.font = font;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ff69b4";
    ctx.fillStyle = "pink";

    text.split("").forEach((char, index) => {
      const offsetX = x + index * fontSize + getRandomOffset(5);
      const offsetY = y + getRandomOffset(5);
      const rotation = getRandomRotation(10);

      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.rotate(rotation);

      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);

      ctx.restore();
    });

    ctx.restore();
  };

  /**
   * テキストを描画する
   */
  const drawText = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageElement = imageRef.current;
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        ctx.drawImage(imageElement, 0, 0);

        const x = 10;
        const y = canvas.height - 30;

        drawTextWithRandomDisplacement(ctx, text, x, y);
      }
    }
  };

  useEffect(() => {
    drawText();
  }, [text, image]);

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
            onLoad={drawText}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              display: "none",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
            }}
          />
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
