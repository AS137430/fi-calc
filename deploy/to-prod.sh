now --prod

if [ $? -eq 0 ]; then
    echo Successfully deployed to ficalc.app!
else
    echo There was an error while deploying the app to the production environment.
fi