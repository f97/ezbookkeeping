#!/bin/sh

set -e

APP_USER="ezbookkeeping"
APP_UID=1000
APP_GID=1000
APP_CMD="/ezbookkeeping/ezbookkeeping"
APP_ARGS="server run"
CONF_PATH=""

# Nếu có biến ENV cấu hình thì thêm vào
if [ -n "${EBK_CONF_PATH}" ]; then
  CONF_PATH="--conf-path=${EBK_CONF_PATH}"
fi

# Kiểm tra quyền ghi và chown nếu cần
fix_permissions() {
  for dir in /ezbookkeeping/data /ezbookkeeping/log /ezbookkeeping/storage; do
    if [ ! -w "$dir" ]; then
      echo "[entrypoint] Không có quyền ghi vào $dir, đang cấp quyền cho UID $APP_UID..."
      chown -R $APP_UID:$APP_GID "$dir" || echo "[entrypoint] ⚠️ Không thể chown $dir"
    fi
  done
}

# Nếu chạy lệnh shell custom (docker run image ...), thì chạy như root
if [ $# -gt 0 ]; then
  exec "$@"
else
  fix_permissions
  echo "[entrypoint] Chạy ứng dụng với user $APP_USER ($APP_UID)"
  exec su-exec $APP_UID:$APP_GID $APP_CMD $APP_ARGS $CONF_PATH
fi
