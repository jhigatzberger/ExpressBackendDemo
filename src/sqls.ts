export function createUser (username:string, password:string) {
  return `INSERT INTO member (member_name, member_password) VALUES ('${username}', '${password}');`
}
export function fetchUser (username:string) {
  return `SELECT * FROM member WHERE member_name='${username}'`
}
export function createUserCrypto (userid:number) {
  return `INSERT INTO crypto (member_id, crypto_amount) VALUES (${userid}, 0);`
}
export function changeCrypto (userid:number, amount:string) {
  return `Update crypto Set crypto_amount = crypto_amount + ${amount}  WHERE member_id=${userid}`
}
export function fetchCrypto (userid:number) {
  return `SELECT crypto_amount FROM crypto WHERE member_id=${userid}`
}
