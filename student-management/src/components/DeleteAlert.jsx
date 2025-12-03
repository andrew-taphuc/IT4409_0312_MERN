import '../App.css'

function DeleteAlert({ student, onConfirm, onCancel }) {
  if (!student) {
    return null
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-alert-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-alert-header">
          <h2>Xác nhận xóa</h2>
        </div>
        <div className="delete-alert-body">
          <p>
            Bạn có chắc chắn muốn xóa sinh viên <strong>"{student.name}"</strong>?
          </p>
          <p className="delete-alert-warning">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="delete-alert-actions">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            Hủy
          </button>
          <button 
            className="delete-confirm-btn"
            onClick={() => onConfirm(student)}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAlert

