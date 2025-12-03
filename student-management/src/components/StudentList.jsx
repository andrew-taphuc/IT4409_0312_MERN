import '../App.css'

function StudentList({ students, loading, error, onRetry, onEdit, onDelete }) {
  if (loading) {
    return <p className="loading">Đang tải dữ liệu...</p>
  }

  if (error) {
    return (
      <div className="error">
        <p>Lỗi: {error}</p>
        {onRetry && <button onClick={onRetry}>Thử lại</button>}
      </div>
    )
  }

  if (students.length === 0) {
    return <p className="empty">Chưa có sinh viên nào trong danh sách.</p>
  }

  return (
    <div className="students-container">
      <h2>Danh sách sinh viên ({students.length})</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>MSSV</th>
            <th style={{ textAlign: "center" }}>Họ và tên</th>
            <th style={{ textAlign: "center" }}>Tuổi</th>
            <th style={{ textAlign: "center" }}>Lớp</th>
            <th style={{ textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td style={{ textAlign: "center" }}>{student.mssv || 'N/A'}</td>
              <td style={{ textAlign: "left" }}>{student.name}</td>
              <td style={{ textAlign: "center" }}>{student.age}</td>
              <td style={{ textAlign: "center" }}>{student.class}</td>
              <td style={{ textAlign: "center" }}>
                <div className="action-buttons-cell" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                  {onEdit && (
                    <button 
                      className="edit-btn"
                      onClick={() => onEdit(student)}
                      title="Sửa"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="delete-btn"
                      onClick={() => onDelete(student)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList

