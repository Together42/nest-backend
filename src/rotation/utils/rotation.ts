interface DayObject {
  day: number;
  arr: number[];
}

interface RotationAttendeeInfo {
  userId: number;
  year: number;
  month: number;
  attendLimit: number[];
  attended: number;
}

// function checker(rotationArray: DayObject[]) {
//   const frequencyMap = new Map<number, number>();

//   for (const item of rotationArray) {
//     for (const num of item.arr) {
//       const count = frequencyMap.get(num) || 0;
//       frequencyMap.set(num, count + 1);
//     }
//   }
//   const sortedFrequencyMap = new Map(
//     [...frequencyMap.entries()].sort((a, b) => a[0] - b[0]),
//   );
//   sortedFrequencyMap.forEach((count, num) => {
//     console.log(`${num}: ${count}`);
//   });
// }

function shuffle(array: RotationAttendeeInfo[]) {
  array.sort(() => Math.random() - 0.5);
}

function sortByArray(array: RotationAttendeeInfo[]) {
  array.sort(
    (a: { attendLimit: string | any[] }, b: { attendLimit: string | any[] }) =>
      b.attendLimit.length - a.attendLimit.length,
  );
}

export function createRotation(
  rotationAttendeeInfo: RotationAttendeeInfo[],
  monthArrayInfo: DayObject[][],
): DayObject[] {
  //  const rotationArray = monthArrayInfo.flat(Infinity) as DayObject[];
  const canDuplicate = rotationAttendeeInfo.length < 10 ? true : false;
  let participation = 1;

  shuffle(rotationAttendeeInfo);
  sortByArray(rotationAttendeeInfo);

  let checkContinue = false as boolean;
  let continueIndex = 0;
  let isLooped = false as boolean;
  let isLoopedAgain = false as boolean;

  for (let i = 0; i < monthArrayInfo.length; i++) {
    for (let j = 0; j < monthArrayInfo[i].length; j++) {
      let participant1 = undefined;
      let arrIndex = 0;
      for (let k = 0; k < rotationAttendeeInfo.length; k++) {
        if (checkContinue === true) {
          k += continueIndex;
        }

        if (
          rotationAttendeeInfo[k].attended < participation &&
          !rotationAttendeeInfo[k].attendLimit.includes(
            monthArrayInfo[i][j].day,
          ) &&
          !monthArrayInfo[i][j].arr.includes(rotationAttendeeInfo[k].userId)
        ) {
          participant1 = rotationAttendeeInfo[k];
          participant1.attended += 1;
          break;
        }
      }
      if (canDuplicate && participant1 === undefined) {
        for (let k = 0; k < rotationAttendeeInfo.length; k++) {
          if (
            rotationAttendeeInfo[k].attended < participation + 1 &&
            !rotationAttendeeInfo[k].attendLimit.includes(
              monthArrayInfo[i][j].day,
            ) &&
            !monthArrayInfo[i][j].arr.includes(rotationAttendeeInfo[k].userId)
          ) {
            participant1 = rotationAttendeeInfo[k];
            participant1.attend += 1;
            break;
          }
        }
      }
      if (participant1 === undefined) {
        participation += 1;
        if (j > 0) {
          j -= 1;
        } else {
          j = -1;
        }
        if (isLooped === false) {
          isLooped = true;
        } else {
          participation -= 1;
          isLooped = false;
          j += 1;
        }
        continue;
      } else {
        continueIndex = 0;
        checkContinue = false;
        isLooped = false;
        monthArrayInfo[i][j].arr[arrIndex++] = participant1.userId;
      }

//      shuffle(rotationAttendeeInfo);
//      sortByArray(rotationAttendeeInfo);
//
//      let participant2 = undefined;
//      for (let k = 0; k < rotationAttendeeInfo.length; k++) {
//        if (
//          rotationAttendeeInfo[k].attended < participation &&
//          !rotationAttendeeInfo[k].attendLimit.includes(
//            monthArrayInfo[i][j].day,
//          ) &&
//          !monthArrayInfo[i][j].arr.includes(rotationAttendeeInfo[k].userId)
//        ) {
//          participant2 = rotationAttendeeInfo[k];
//          participant2.attended += 1;
//          break;
//        }
//      }
//      if (canDuplicate && participant2 === undefined) {
//        for (let k = 0; k < rotationAttendeeInfo.length; k++) {
//          if (
//            rotationAttendeeInfo[k].attended < participation + 1 &&
//            !rotationAttendeeInfo[k].attendLimit.includes(
//              monthArrayInfo[i][j].day,
//            ) &&
//            !monthArrayInfo[i][j].arr.includes(rotationAttendeeInfo[k].userId)
//          ) {
//            participant2 = rotationAttendeeInfo[k];
//            participant2.attended += 1;
//            break;
//          }
//        }
//      }
//      if (participant2 === undefined) {
//        participation += 1;
//        if (j > 0) {
//          j -= 1;
//        } else {
//          j = -1;
//        }
//        if (participant1 && isLooped === false) {
//          if (isLoopedAgain === true) {
//            participation -= 1;
//            isLoopedAgain = false;
//            continue;
//          }
//          const index = rotationAttendeeInfo.findIndex(
//            (obj) => obj.userId === participant1.userId,
//          );
//          continueIndex = index;
//          checkContinue = true;
//          isLooped = true;
//          isLoopedAgain = true;
//          participant1.attended -= 1;
//          monthArrayInfo[i][j + 1].arr[0] = 0;
//        } else if (isLooped) {
//          participation -= 1;
//          isLooped = false;
//          isLoopedAgain = false;
//          j += 1;
//        }
//        continue;
//      } else {
//        continueIndex = 0;
//        checkContinue = false;
//        isLooped = false;
//        isLoopedAgain = false;
//        monthArrayInfo[i][j].arr[arrIndex--] = participant2.userId;
//      }
    }
  }

  const rotationArray = monthArrayInfo.flat(Infinity) as DayObject[];

  //  console.log(rotationArray);
  //  checker(rotationArray);
  return rotationArray;
}
