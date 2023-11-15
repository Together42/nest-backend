import { HttpException } from '@nestjs/common';

/**
 * Fisher-Yates shuffle 방식으로 배열의 요소들을 랜덤으로 섞어줍니다.
 * @param array 모든 타입의 배열을 받습니다.
 */
export const shuffleArray = (array: any[]) => {
  for (let idx = 0; idx < array.length; idx++) {
    const randomIdx = Math.floor(Math.random() * (idx + 1));
    [array[idx], array[randomIdx]] = [array[randomIdx], array[idx]];
  }
};

export const isHttpException = (error: any): error is HttpException => {
  if ('response' in error && 'status' in error) {
    return true;
  }
  return false;
};
