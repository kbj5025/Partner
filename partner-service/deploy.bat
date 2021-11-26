ssh -i "C:front.pem" ubuntu@54.180.124.220 "pkill -f node"
ssh -i "C:front.pem" ubuntu@54.180.124.220 "cd /home/ubuntu/Partner/partner-service; git pull origin master; npm install; npm run build; nohup npm start 1>/dev/null 2>&1 &"
