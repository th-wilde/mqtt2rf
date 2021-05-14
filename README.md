# mqtt2rf
Hooks up casual rf-controlled plugs to mqtt

## How to use
1. Be `root`
1. Install `nodejs` on jour raspberry pi
1. Build `send`-Executable from https://github.com/xkonni/raspberry-remote
2. Place `send` along the files from this reposiotires
3. Change directory into the repository and run `/usr/bin/npm start`
4. Check if it works. Stop execution witch `Ctrl+C`. Adjust whatever needed if an problem occur and try again with step 5. If everything is fine, continue with step 7.
5. Create systemd-service-unit-file at `/etc/systemd/system/mqtt2rf.service` with follwing content:
```ini
[Unit]
Description=MQTT2RF Bridge
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/repository/mqtt2rf #<--- adjust to match your environment
ExecStart=/usr/bin/npm start
User=root
SendSIGKILL=no
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
7. Reload systemd serice deamon with `systemctl daemon-reload`
8. Enable the mqtt2rf service with `systemctl enable mqtt2rf`
9. Start the mqtt2rf service with `systemctl start mqtt2rf`
