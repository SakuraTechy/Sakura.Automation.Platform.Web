export const certificateStatusOptions = [
  { id: '0', name: '待提交' },
  { id: '1', name: '待审批' },
  { id: '2', name: '已通过' },
  { id: '3', name: '已驳回' }
]

export function getCertificateStatus(status) {
  const item = certificateStatusOptions.find(option => String(option.id) === String(status))
  return item ? item.name : '未知状态'
}
