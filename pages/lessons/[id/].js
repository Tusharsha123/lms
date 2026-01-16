import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Editor from '@monaco-editor/react'

export default function Lesson() {
  const router = useRouter()
  const { id } = router.query
  const [lesson, setLesson] = useState(null)
  const [code, setCode] = useState('// Write your code here')

  useEffect(() => {
    if (id) {
      fetchLesson()
    }
  }, [id])

  async function fetchLesson() {
    const res = await fetch(`/api/lessons/${id}`)
    if (res.ok) {
      const data = await res.json()
      setLesson(data)
    }
  }

  function handleEditorChange(value) {
    setCode(value)
  }

  function runCode() {
    try {
      // Simple eval for demo - in production, use a sandbox
      const result = eval(code)
      alert('Result: ' + result)
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  if (!lesson) return <p>Loading...</p>

  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      <Link href={`/courses/${lesson.course_id}`}>← Back to Course</Link>
      <h1>{lesson.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      <h2>Code Editor</h2>
      <div style={{ height: '400px', border: '1px solid #ccc' }}>
        <Editor
          height="100%"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
        />
      </div>
      <button onClick={runCode} style={{ marginTop: 8, padding: '8px 12px' }}>Run Code</button>
    </main>
  )
}