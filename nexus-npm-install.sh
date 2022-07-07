#npm-install-has-run is a semaphore file to be used across stages as env variables dont persist
if [ ! -f npm-install-nexus-has-run ]; then
    echo "npm install for nexus iq not run already, running."
    echo "nexus iq evnronment:"$nexusenv
    
    npm install $nexusenv
    
    if [ $? -ne 0 ]; then
        echo "npm install for nexus iq failed, exiting.."
        exit 1
    fi
    touch npm-install-nexus-has-run
else
    echo "npm install for nexus iq was already run... SKIPPING!"
fi

