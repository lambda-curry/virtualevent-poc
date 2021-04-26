#!/bin/bash

if echo $HEAD | grep "^feature";
  then return 1
else
  return 0
fi