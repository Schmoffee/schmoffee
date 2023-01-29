function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return rgbToHex(r, g, b);
}

function componentToHex(c: number): string {
  const hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
  return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function generateRandomPin(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function convertToKey(text: string) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let code = text.toUpperCase().charCodeAt(i);
    if (code > 64 && code < 91) result += code - 64 + ' ';
  }

  return result.slice(0, result.length - 1);
}

function encryptOnce(plaintext: string, key: string): string {
  let ciphertext = '';
  let key_index = 0;
  const msg_len = plaintext.length;
  const msg_list = plaintext.split('');
  const key_list = key.split(' ');
  const sorted_key_list = key.split(' ').sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const col = key_list.length;
  const row = Math.ceil(msg_len / col);
  const fill_null = row * col - msg_len;
  const padding = '_'.repeat(fill_null);
  const new_msg = msg_list.concat(padding.split(''));
  const matrix = [];
  for (let i = 0; i < row; i++) {
    matrix[i] = new_msg.slice(i * col, i * col + col);
  }

  for (let i = 0; i < col; i++) {
    const curr_index = key_list.indexOf(sorted_key_list[key_index]);
    for (let j = 0; j < row; j++) {
      ciphertext += matrix[j][curr_index];
    }
    key_index++;
  }

  return ciphertext;
}

function multiEncrypt(plaintext: string, keys: string[]): string {
  let ciphertext = plaintext;
  for (let i = 0; i < keys.length; i++) {
    ciphertext = encryptOnce(ciphertext, keys[i]);
  }
  return ciphertext;
}

function generateKeys() {
  const key1 = convertToKey('KAIDO');
  const key2 = convertToKey('GDOFSHINB');
  const key3 = convertToKey('CHEY');
  return [key1, key2, key3];
}

function getOrderId() {
  const color = generateRandomColor();
  const final_color = '#' + color;
  const pin = generateRandomPin();
  const plaintext = color + pin;
  const keys = generateKeys();
  const orderId = '#' + multiEncrypt(plaintext, keys).replace(/_/g, '');
  return {orderId, final_color, pin};
}

export {getOrderId};
