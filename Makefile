
# ------ iOS commands ------ #

full_rebuild_ios:
	npm install && cd ios/ && pod install && cd ../

build_ios:
	cd ios/ && pod install && cd ../

run_ios:
	npm run ios