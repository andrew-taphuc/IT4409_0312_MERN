import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import AddStudentForm from './components/AddStudentForm'
import EditStudent from './components/EditStudent'
import DeleteAlert from './components/DeleteAlert'
import StudentList from './components/StudentList'

const API_URL = 'http://localhost:3000/api/students'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [deletingStudent, setDeletingStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("") // "" | "A-Z" | "Z-A"

  // Fetch danh sách học sinh khi component load
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(API_URL)
      setStudents(response.data)
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách học sinh')
      console.error('Lỗi khi fetch dữ liệu:', err)
    } finally {
      setLoading(false)
    }
  }

  // Hàm xử lý khi học sinh mới được thêm
  const handleStudentAdded = (newStudent) => {
    setStudents([...students, newStudent])
    setShowAddForm(false) // Ẩn form sau khi thêm thành công
  }

  // Hàm xử lý khi học sinh được cập nhật
  const handleStudentUpdated = (updatedStudent) => {
    setStudents(students.map(student => 
      student._id === updatedStudent._id ? updatedStudent : student
    ))
    setEditingStudent(null) // Đóng form edit
  }

  // Hàm xử lý khi click nút edit
  const handleEdit = (student) => {
    setEditingStudent(student)
    setShowAddForm(false) // Ẩn form add nếu đang hiển thị
  }

  // Hàm hủy edit
  const handleCancelEdit = () => {
    setEditingStudent(null)
  }

  // Hàm xử lý khi click nút xóa - hiển thị DeleteAlert
  const handleDeleteClick = (student) => {
    setDeletingStudent(student)
  }

  // Hàm xác nhận xóa học sinh
  const handleDeleteConfirm = async (student) => {
    try {
      await axios.delete(`${API_URL}/${student._id}`)
      // Xóa học sinh khỏi danh sách
      setStudents(students.filter(s => s._id !== student._id))
      setDeletingStudent(null) // Đóng alert
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Không thể xóa học sinh')
      console.error('Lỗi khi xóa học sinh:', err)
      setDeletingStudent(null) // Đóng alert ngay cả khi có lỗi
    }
  }

  // Hàm hủy xóa
  const handleDeleteCancel = () => {
    setDeletingStudent(null)
  }

  // Hàm lấy chữ cái đầu của từ cuối cùng trong tên
  const getLastWordFirstChar = (name) => {
    if (!name || !name.trim()) return ''
    const words = name.trim().split(/\s+/)
    const lastWord = words[words.length - 1]
    return lastWord.charAt(0).toUpperCase()
  }

  // Filter và sort students
  const getFilteredAndSortedStudents = () => {
    let filtered = students

    // Filter theo tên
    if (searchTerm.trim()) {
      filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort theo chữ cái đầu của từ cuối cùng trong tên
    if (sortOrder === "A-Z") {
      filtered = [...filtered].sort((a, b) => {
        const charA = getLastWordFirstChar(a.name)
        const charB = getLastWordFirstChar(b.name)
        return charA.localeCompare(charB, 'vi')
      })
    } else if (sortOrder === "Z-A") {
      filtered = [...filtered].sort((a, b) => {
        const charA = getLastWordFirstChar(a.name)
        const charB = getLastWordFirstChar(b.name)
        return charB.localeCompare(charA, 'vi')
      })
    }

    return filtered
  }

  const filteredAndSortedStudents = getFilteredAndSortedStudents()

  return (
    <div className="app-container">
      <h1>Quản Lý Sinh Viên</h1>
      
      {/* Nút toggle để hiện/ẩn form thêm học sinh */}
      <div className="action-buttons">
        {!editingStudent && (
          <button 
            className="toggle-form-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Ẩn form thêm học sinh' : 'Thêm học sinh mới'}
          </button>
        )}
      </div>

      {/* Form thêm học sinh - Modal overlay */}
      {showAddForm && !editingStudent && (
        <AddStudentForm 
          onStudentAdded={handleStudentAdded}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* Form chỉnh sửa học sinh - Modal overlay */}
      {editingStudent && (
        <EditStudent 
          student={editingStudent}
          onStudentUpdated={handleStudentUpdated}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Delete Alert - Modal overlay */}
      {deletingStudent && (
        <DeleteAlert
          student={deletingStudent}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {/* Search và Sort */}
      <div className="search-sort-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="sort-box">
          <button
            className={`sort-btn ${sortOrder === "A-Z" ? "active" : ""}`}
            onClick={() => setSortOrder(sortOrder === "A-Z" ? "" : "A-Z")}
          >
            Sắp xếp A-Z
          </button>
          <button
            className={`sort-btn ${sortOrder === "Z-A" ? "active" : ""}`}
            onClick={() => setSortOrder(sortOrder === "Z-A" ? "" : "Z-A")}
          >
            Sắp xếp Z-A
          </button>
        </div>
      </div>
      
      <StudentList 
        students={filteredAndSortedStudents}
        loading={loading}
        error={error}
        onRetry={fetchStudents}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
    </div>
  )
}

export default App
