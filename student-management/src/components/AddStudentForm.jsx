import { useState } from 'react'
import axios from 'axios'
import '../App.css'

const API_URL = 'http://localhost:3000/api/students'

function AddStudentForm({ onStudentAdded, onClose }) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [mssv, setMssv] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Reset messages
    setSubmitError(null)
    setSubmitSuccess(false)
    
    // Validation
    if (!name.trim() || !age || !stuClass.trim() || !mssv.trim()) {
      setSubmitError('Vui lòng điền đầy đủ thông tin')
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum <= 0) {
      setSubmitError('Tuổi phải là một số dương')
      return
    }

    try {
      setSubmitting(true)
      const response = await axios.post(API_URL, {
        name: name.trim(),
        age: ageNum,
        class: stuClass.trim(),
        mssv: mssv.trim()
      })
      
      // Gọi callback để thông báo cho component cha
      if (onStudentAdded) {
        onStudentAdded(response.data)
      }
      
      // Reset form
      setName("")
      setAge("")
      setStuClass("")
      setMssv("")
      setSubmitSuccess(true)
      
      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        setSubmitSuccess(false)
        if (onClose) {
          onClose()
        }
      }, 1500)
    } catch (err) {
      setSubmitError(err.response?.data?.error || err.message || 'Không thể thêm học sinh')
      console.error('Lỗi khi thêm học sinh:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm học sinh mới</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-group">
          <label htmlFor="mssv">Mã số sinh viên *</label>
          <input
            type="text"
            id="mssv"
            placeholder="Nhập mã số sinh viên"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Họ và tên *</label>
          <input
            type="text"
            id="name"
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="age">Tuổi *</label>
          <input
            type="number"
            id="age"
            placeholder="Nhập tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="1"
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="class">Lớp *</label>
          <input
            type="text"
            id="class"
            placeholder="Nhập lớp"
            value={stuClass}
            onChange={(e) => setStuClass(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        
        {submitError && (
          <div className="form-error">{submitError}</div>
        )}
        
        {submitSuccess && (
          <div className="form-success">Thêm học sinh thành công!</div>
        )}
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Đang thêm...' : 'Thêm học sinh'}
        </button>
        </form>
      </div>
    </div>
  )
}

export default AddStudentForm

