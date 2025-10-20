import UploadForm from './components/UploadForm'

export default function App() {
  return (
    <div className="app-bg">
      <div className="card">
        <h1 className="title">Upload Spec File</h1>
        <p className="subtitle">Excel (.xlsx or .xls)</p>
        <UploadForm />
        <div className="footer">Powered by Codex AI Spec Analyzer</div>
      </div>
    </div>
  )
}

