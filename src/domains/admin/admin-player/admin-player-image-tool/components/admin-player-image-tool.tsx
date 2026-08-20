/**
 * 작성자: KYD
 * 기능: 선수 이미지 배경제거 도구 - 여러 이미지의 배경을 브라우저에서 제거해 투명 PNG 로 다운로드
 * 프로세스 설명:
 *  1) 이미지 여러 장 선택 → 2) 배경 제거(@imgly/background-removal, WASM) → 3) 투명 PNG 미리보기/다운로드
 *  - 원본 파일명 그대로 유지하며 "_nobg.png" 를 붙여 저장한다.
 */
import { useRef, useState } from "react";

import { Download, Eraser, Loader2, Trash2, Upload } from "lucide-react";

import { removePlayerImageBackground } from "@admin/admin-player/admin-player-image-tool/utils/remove-background";

type ImageStatus = "pending" | "processing" | "done" | "error";

interface IImageItem {
  id: string;
  baseName: string;
  file: File;
  originalUrl: string;
  resultUrl: string | null;
  status: ImageStatus;
  errorMessage?: string;
}

// 투명 영역을 보여주기 위한 체커보드 배경
const CHECKERBOARD = "repeating-conic-gradient(#3a3f4b 0% 25%, #2a2e38 0% 50%) 50% / 16px 16px";

const AdminPlayerImageTool = () => {
  //SECTION 상태값 영역
  const [items, setItems] = useState<IImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const updateItem = (id: string, patch: Partial<IImageItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    const newItems: IImageItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      baseName: file.name.replace(/\.[^.]+$/, ""),
      file,
      originalUrl: URL.createObjectURL(file),
      resultUrl: null,
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveBackgrounds = async () => {
    setIsProcessing(true);
    for (const item of items) {
      if (item.status === "done") continue;
      updateItem(item.id, { status: "processing", errorMessage: undefined });
      try {
        const blob = await removePlayerImageBackground(item.file);
        updateItem(item.id, { status: "done", resultUrl: URL.createObjectURL(blob) });
      } catch (err) {
        updateItem(item.id, { status: "error", errorMessage: err instanceof Error ? err.message : "처리 실패" });
      }
    }
    setIsProcessing(false);
  };

  const downloadItem = (item: IImageItem) => {
    if (!item.resultUrl) return;
    const anchor = document.createElement("a");
    anchor.href = item.resultUrl;
    anchor.download = `${item.baseName}_nobg.png`;
    anchor.click();
  };

  const handleDownloadAll = () => {
    items.filter((item) => item.status === "done").forEach(downloadItem);
  };

  const handleClearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setItems([]);
  };
  //!SECTION 메서드 영역

  const pendingCount = items.filter((item) => item.status === "pending" || item.status === "error").length;
  const doneCount = items.filter((item) => item.status === "done").length;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* 상단 컨트롤 */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <p className="text-yds-c1m text-primary-100/70">
          이미지를 올리면 브라우저에서 배경을 제거해 투명 PNG 로 저장합니다. (첫 실행 시 AI 모델 다운로드로 잠시 지연)
        </p>
        <div className="flex items-center gap-1">
          <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleSelectFiles} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white"
            aria-label="이미지 선택"
            title="이미지 선택"
          >
            <Upload size={20} />
          </button>
          <button
            type="button"
            onClick={handleRemoveBackgrounds}
            disabled={isProcessing || pendingCount === 0}
            className="bg-primary-100/15 text-primary-100 hover:bg-primary-100/30 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="배경 제거 시작"
            title={isProcessing ? "처리 중..." : `배경 제거 (${pendingCount})`}
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Eraser size={20} />}
          </button>
          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={doneCount === 0}
            className="text-primary-100 hover:bg-primary-100/20 flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="전체 다운로드"
            title={`전체 다운로드 (${doneCount})`}
          >
            <Download size={20} />
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={items.length === 0}
            className="flex cursor-pointer items-center justify-center rounded-md p-2 text-red-400 transition-colors hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="전체 비우기"
            title="전체 비우기"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* 결과 그리드 */}
      {items.length === 0 ? (
        <div className="text-primary-100/60 flex h-full w-full items-center justify-center rounded-md border border-dashed border-white/15">
          이미지를 선택하세요
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-4 overflow-y-auto md:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="bg-background-tertiary card-navy-50 flex flex-col gap-2 rounded-md p-3">
              <div className="flex items-center justify-center gap-2">
                <img src={item.originalUrl} alt="원본" className="h-20 w-20 rounded object-cover" />
                <span className="text-primary-100 text-yds-b2">→</span>
                <div className="h-20 w-20 overflow-hidden rounded" style={{ background: CHECKERBOARD }}>
                  {item.resultUrl ? (
                    <img src={item.resultUrl} alt="배경 제거" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {item.status === "processing" ? (
                        <Loader2 size={20} className="text-primary-100 animate-spin" />
                      ) : (
                        <span className="text-yds-c1m text-white/50">{item.status === "error" ? "실패" : "대기"}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-yds-c1m truncate text-white" title={item.baseName}>
                {item.baseName}
              </p>
              {item.status === "done" ? (
                <button
                  type="button"
                  onClick={() => downloadItem(item)}
                  className="text-primary-100 hover:bg-primary-100/20 flex items-center justify-center gap-1 rounded-md p-1 transition-colors hover:text-white"
                  aria-label={`${item.baseName} 다운로드`}
                >
                  <Download size={14} />
                  <span className="text-yds-c1m">다운로드</span>
                </button>
              ) : item.status === "error" ? (
                <p className="text-yds-c1m truncate text-red-400" title={item.errorMessage}>
                  {item.errorMessage}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPlayerImageTool;
