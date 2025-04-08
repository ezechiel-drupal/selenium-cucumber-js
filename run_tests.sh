#cucumber tag
tag=$1

#run cucumber tests
pnpm run cucumber --profile $tag || pnpm run postcucumber
