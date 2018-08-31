now --public --name=ficalc | xargs -I {} now alias {} staging.ficalc.app

if [ $? -eq 0 ]; then
    echo Successfully deployed to staging.ficalc.app!
else
    echo There was an error while deploying the app to the staging environment.
fi