/**
 * This function generates a random string of a given length, containing a mix of uppercase and lowercase letters, as well as numbers.

 * Here's a detailed explanation of the code:
 *
 * 1. The function takes in a single argument, length, which represents the desired length of the random string.
 * 2. The variable characters is defined as a string containing all the possible characters that could be included in the random string. This includes uppercase and lowercase letters, as well as numbers.
 * 3. Array.from() method is used to create an array with a length of length and a mapper function that returns the value of characters array element at the index of a random number generated by Math.floor(Math.random() * characters.length).
 * 4. The .join('') method is used to join all the characters in the array together and returns the final random string.
 * 
 * This implementation uses the Array.from() method to create an array with the desired length, and then uses Math.random() and Math.floor() to generate random indexes for the characters array and return the corresponding character. This approach eliminates the need for a loop to iterate and generate the random string.
 */
// import "dotenv/config";
// require("dotenv").config();

// import { createHash } from "crypto";
import axios from "axios";
import { useRouter } from "vue-router";

export const getUserSession = () => {
  const router = useRouter();
  const temp = sessionStorage.getItem("userDetails");
  if (temp) {
    return JSON.parse(temp);
  } else router.replace("/login");
};

export const getUserToken = () => {
  const session = sessionStorage.getItem("userDetails");
  if (!session) return null;

  const temp = JSON.parse(session);
  if (!temp) return null;

  return temp.token;
};

/**
 * The function checks if the user is authenticated by retrieving the session from sessionStorage and
 * returning true if a token is present.
 * @returns The function `isAuthenticated` returns a boolean value. It returns `true` if there is a
 * valid token stored in the `userDetails` session storage, and `false` otherwise.
 */
export const isAuthenticated = () => {
  const session = sessionStorage.getItem("userDetails");
  if (!session) return false;
  const temp = JSON.parse(session);
  if (temp.token) return true;
  return false;
};

/**
 * The `groupBy` function takes an array of objects and a key getter function, and returns an array of
 * objects grouped by the values of the specified key.
 * @param {object[]} list - An array of objects that you want to group.
 * @param {any} keyGetter - The `keyGetter` parameter is a function that takes an item from the `list`
 * array and returns the key by which the items should be grouped.
 * @returns The function `groupBy` returns an array of objects. Each object in the array represents a
 * group and has two properties: `head` and `values`. The `head` property represents the key value that
 * was used to group the items, and the `values` property is an array of objects that belong to that
 * group.
 */
// eslint-disable-next-line
export const groupBy = (list: object[], keyGetter: any) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  // return map;
  const finalData = [];
  for (const head of map.keys()) {
    const val = { head, values: map.get(head) };
    finalData.push(val);
  }
  // console.clear();
  return finalData;
};

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    // eslint-disable-next-line
    (_) => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

export const generateRandomNumbers = (length: number): string => {
  const characters = "0123456789";
  return Array.from(
    { length },
    // eslint-disable-next-line
    (_) => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

export const getString = (arr: string[]): string => {
  let ns = "";
  for (let i = 0; i < arr.length; i++) {
    ns += arr[i].toString();
    if (i != arr.length - 1) ns += " ⏺ ";
  }
  return ns;
};

// export const hashString = (value: string): string => {
//   /** IDEAL */
//   const salt = randomBytes(16).toString("hex"); //generates random salt
//   const hash = createHash("sha512");
//   hash.update(value + salt);

//   return hash.digest("hex");
// };

export const sendSMS = (text: string) => {
  console.log({ text });
  // const url = import.meta.env.sms_url as string;
  // const headers = {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  //   Host: import.meta.env.sms_host,
  //   Authorization: `key ${import.meta.env.sms_api}`,
  //   withCredentials: true,
  // };

  // console.log({ headers });

  // const destinations = [
  //   // { to: "+233557759104" },
  //   // { to: "+233501286408" },
  //   { to: "+233501377213" },
  //   // { to: "+233207933484" },
  // ];
  // const messages = [{ text, type: 0, sender: "SMS TEST", destinations }];

  // axios
  //   .post(
  //     url,
  //     { messages },
  //     {
  //       headers,
  //     }
  //   )
  axios
    .get(
      `http://localhost:10491/v1/sms?text=${text}`
      // { messages },
      // {
      //   headers,
      // }
    )
    .then((response) => {
      const data = response.data;
      return console.log({ data });
      // window.location;
      // return res.send("OK");
    })
    .catch((error) => {
      return console.log({ error });
    });
};

export const validateEmail = (email: string): boolean | null => {
  if (!email) return null;
  const pattern = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
  );
  return pattern.test(email);
};

export const validateStringLength = (
  string: string,
  length: number
): boolean => {
  return new RegExp(`^.{10,${length}}$`).test(string);
};
