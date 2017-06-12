#! /bin/bash

git status
echo "is this ok? (Y/n):"
read ans
case $ans in
	N|n )
		exit
		;;
	* );;
esac

echo "message:"
LFS="\n"
read ans

date=`date +%d%m%y`

if [ -f "upload.log" ]; then
	cont=(`cat upload.log`)
	
	if [ $date = ${cont[0]} ]; then
		count=${cont[1]}
	else
		count=1
	fi
else
	count=1
fi

if [ $count -lt 10 ]; then
	count="0$count"
fi

git add -A
git commit -e -m "$date#$count: $ans"

echo "$date `expr $count + 1`" > upload.log

git push -u origin master
