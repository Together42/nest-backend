// 로테이션... 언젠간 고치겠습니다...

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

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function splitArrayByThirds(arr: RotationAttendeeInfo[]): {
  large: RotationAttendeeInfo[];
  medium: RotationAttendeeInfo[];
  small: RotationAttendeeInfo[];
} {
  const sortedArray = arr
    .slice()
    .sort((a, b) => b.attendLimit.length - a.attendLimit.length);
  const oneThirdIndex = Math.floor(sortedArray.length / 3);
  const largeGroup = sortedArray.slice(0, oneThirdIndex);
  const mediumGroup = sortedArray.slice(oneThirdIndex, oneThirdIndex * 2);
  const smallGroup = sortedArray.slice(oneThirdIndex * 2);

  return { large: largeGroup, medium: mediumGroup, small: smallGroup };
}

function checkAllParticipation(
  attendeeInfo: RotationAttendeeInfo[],
  participation: number,
  rotationArrayLength: number,
): boolean {
  let allParticipated = true;

  for (let i = 0; i < attendeeInfo.length; i++) {
    if (
      attendeeInfo[i].attended < participation &&
      attendeeInfo[i].attendLimit.length < rotationArrayLength
    ) {
      allParticipated = false;
    }
  }
  return allParticipated;
}

function setAttendee(
  attendeeInfo: RotationAttendeeInfo[],
  rotationArray: DayObject[],
  maxParticipation: number,
) {
  let index = 0;
  let participation = 1;

  for (let i = 0; i < rotationArray.length; i++) {
    if (i === rotationArray.length - 1 && index === 0) {
      i = 0;
      index++;
    }

    for (let j = 0; j < attendeeInfo.length; j++) {
      if (
        rotationArray[i].arr[index] === 0 &&
        !attendeeInfo[j].attendLimit.includes(rotationArray[i].day) &&
        attendeeInfo[j].attended < participation
      ) {
        rotationArray[i].arr[index] = attendeeInfo[j].userId;
        attendeeInfo[j].attended++;
        attendeeInfo[j].attendLimit.push(rotationArray[i].day);
      }
    }

    if (
      checkAllParticipation(
        attendeeInfo,
        participation,
        rotationArray.length,
      ) &&
      participation <= maxParticipation &&
      i % 2 === 0 // 연속 근무는 피하게
    ) {
      participation++;
      shuffle(attendeeInfo);
    }
  }
}

function checker(rotationArray: DayObject[]) {
  const frequencyMap = new Map<number, number>();

  for (const item of rotationArray) {
    for (const num of item.arr) {
      const count = frequencyMap.get(num) || 0;
      frequencyMap.set(num, count + 1);
    }
  }
  const sortedFrequencyMap = new Map(
    [...frequencyMap.entries()].sort((a, b) => a[0] - b[0]),
  );
  sortedFrequencyMap.forEach((count, num) => {
    console.log(`${num}: ${count}`);
  });
}

export function createRotation(
  rotationAttendeeInfo: RotationAttendeeInfo[],
  monthArrayInfo: DayObject[][],
): DayObject[] {
  const rotationArray = monthArrayInfo.flat(Infinity) as DayObject[];
  const maxParticipation = Math.ceil(
    (rotationArray.length * 2) / rotationAttendeeInfo.length,
  );

  const { large, medium, small } = splitArrayByThirds(rotationAttendeeInfo);
  shuffle(large);
  shuffle(medium);
  shuffle(small);

  setAttendee(large, rotationArray, maxParticipation);
  setAttendee(medium, rotationArray, maxParticipation);
  setAttendee(small, rotationArray, maxParticipation);
  checker(rotationArray);
  console.log(rotationArray);
  // 실패...

  return rotationArray;
}
