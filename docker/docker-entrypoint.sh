#!/bin/sh

set -e

conf_path_param=""

# Gán quyền ghi nếu mount volume từ host mà không ghi được
fix_permissions() {
  for dir in /ezbookkeeping/data /ezbookkeeping/log /ezbookkeeping/storage; do
    if [ ! -w "$dir" ]; then
      echo "[entrypoint] Không có quyền ghi vào $dir, đang cấp quyền 777..."
      chmod -R 777 "$dir"
    fi
  done
}

# Gọi fix
fix_permissions

# Xử lý tham số cấu hình nếu có
if [ "${EBK_CONF_PATH}" != "" ]; then
  conf_path_param="--conf-path=${EBK_CONF_PATH}"
fi

# Nếu container được gọi kèm CMD cụ thể thì chạy lệnh đó
if [ $# -gt 0 ]; then
  exec "$@"
else
  # Mặc định chạy server backend
  exec /ezbookkeeping/ezbookkeeping server run ${conf_path_param}
fi
