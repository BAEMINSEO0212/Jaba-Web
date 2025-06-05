let number = 5; // 숫자형 변수 선언
let str = "문자열 입력"; // 문자열 변수 선언
let prime = 1.5123; // 실수형 변수 선언
let is_ok = true; // 불리언 true 값
let is_not = false; // 불리언 false 값
let undefi; // undefined 값 (초기화하지 않음)
let empty = null; // null 값
console.log(undefi, empty); // undefined와 null 값 출력

const sym1 = Symbol('test'); // 심볼 타입 생성
let symbolVar1 = sym1; // 심볼 변수에 할당
const airline = ["비행기", 320, "airbus", ["V1", true]]; // 다양한 타입을 포함한 배열

const obj1 = {}; // 빈 객체 생성
const obj2 = {   // 여러 속성을 가진 객체 생성
    name: "John Doe",
    age: 30,
    isMale: true,
};
console.log(symbolVar1.toString()); // 심볼을 문자열로 변환해 출력
console.log(obj1, obj2, airline); // 객체와 배열을 출력