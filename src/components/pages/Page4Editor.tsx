import PageContainer from "../PageContainer";
import InteractiveCodeEditor from "../InteractiveCodeEditor";

interface Page4EditorProps {
  isDrawingActive: boolean;
  totalPages: number;
}

export default function Page4Editor({ isDrawingActive, totalPages }: Page4EditorProps) {
  return (
    <PageContainer
      pageNumber={4}
      totalPages={totalPages}
      title="03. Reactive Code Sandbox"
      category="ENGINEERING"
      drawingActive={isDrawingActive}
    >
      <InteractiveCodeEditor />
    </PageContainer>
  );
}
