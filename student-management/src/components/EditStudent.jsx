import { useState, useEffect } from 'react'
import axios from 'axios'
import '../App.css'

const API_URL = 'http://localhost:3000/api/students'

function EditStudent({ student, onStudentUpdated, onCancel }) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [stuClass, setStuClass] = useState("")
  const [mssv, setMssv] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Điền sẵn thông tin khi component mount hoặc student thay đổi
  useEffect(() => {
    if (student) {
      setName(student.name || "")
      setAge(student.age?.toString() || "")
      setStuClass(student.class || "")
      setMssv(student.mssv || "")
    }
  }, [student])

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
      const response = await axios.put(`${API_URL}/${student._id}`, {
        name: name.trim(),
        age: ageNum,
        class: stuClass.trim(),
        mssv: mssv.trim()
      })
      
      // Gọi callback để thông báo cho component cha
      if (onStudentUpdated) {
        onStudentUpdated(response.data)
      }
      
      setSubmitSuccess(true)
      
      // Ẩn thông báo thành công sau 2 giây và đóng form
      setTimeout(() => {
        setSubmitSuccess(false)
        if (onCancel) {
          onCancel()
        }
      }, 2000)
    } catch (err) {
      setSubmitError(err.response?.data?.error || err.message || 'Không thể cập nhật học sinh')
      console.error('Lỗi khi cập nhật học sinh:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!student) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa thông tin học sinh</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="add-student-form">
        <div className="form-group">
          <label htmlFor="edit-mssv">Mã số sinh viên *</label>
          <input
            type="text"
            id="edit-mssv"
            placeholder="Nhập mã số sinh viên"
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-name">Họ và tên *</label>
          <input
            type="text"
            id="edit-name"
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-age">Tuổi *</label>
          <input
            type="number"
            id="edit-age"
            placeholder="Nhập tuổi"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="1"
            disabled={submitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="edit-class">Lớp *</label>
          <input
            type="text"
            id="edit-class"
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
          <div className="form-success">Cập nhật học sinh thành công!</div>
        )}
        
        <div className="form-actions">
          <button 
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={submitting}
          >
            Hủy
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default EditStudent

