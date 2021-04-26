#!/bin/bash

if echo $HEAD | grep "^feature";
  then exit 1
elif echo $HEAD | grep "^hotfix";
  then exit 1
else
  exit 0
fi