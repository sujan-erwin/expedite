#npm-install-has-run is a semaphore file to be used across stages as env variables dont persist
if [ ! -f npm-install-has-run ]; then
    echo "npm install not run already, running."

    # npm config set registry http://cicd-nexusoss-01.pcf-east.cvshealthcloud.com/repository/npmjs-group/
    npm install --legacy-peer-deps --save
    npm cache clean --force
    npm install
    if [ $? -ne 0 ]; then
        echo "npm install failed, exiting.."
        exit 1
    fi
    touch npm-install-has-run
else
    echo "npm install was already run... SKIPPING!"
fi
