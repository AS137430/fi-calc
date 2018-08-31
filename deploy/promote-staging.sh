now alias staging.ficalc.app ficalc.app

if [ $? -eq 0 ]; then
    echo Successfully promoted staging!
else
    echo There was an error while promoting staging to production.
fi