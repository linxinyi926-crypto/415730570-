const ANIMAL_TYPES = [ // 建立至少十二種不依賴外部圖片的動物資料
  { key: "cat", name: "貓", color: "#f4a261" }, // 定義貓的資料
  { key: "dog", name: "狗", color: "#b08968" }, // 定義狗的資料
  { key: "rabbit", name: "兔子", color: "#f2c6de" }, // 定義兔子的資料
  { key: "elephant", name: "大象", color: "#9aa6b2" }, // 定義大象的資料
  { key: "lion", name: "獅子", color: "#e9c46a" }, // 定義獅子的資料
  { key: "panda", name: "熊貓", color: "#dfe7e8" }, // 定義熊貓的資料
  { key: "penguin", name: "企鵝", color: "#bde0fe" }, // 定義企鵝的資料
  { key: "giraffe", name: "長頸鹿", color: "#f6d365" }, // 定義長頸鹿的資料
  { key: "fox", name: "狐狸", color: "#f28c28" }, // 定義狐狸的資料
  { key: "frog", name: "青蛙", color: "#90be6d" }, // 定義青蛙的資料
  { key: "monkey", name: "猴子", color: "#a98467" }, // 定義猴子的資料
  { key: "tiger", name: "老虎", color: "#f4a261" } // 定義老虎的資料
]; // 完成動物資料表
const UI = { ink: "#18324a", navy: "#102a43", blue: "#1769aa", green: "#a7c957", red: "#e63946", gold: "#ffca3a", white: "#ffffff" }; // 集中管理介面色彩
const INSTRUCTION = "玩法：按住下方動物名稱，拖到上方對應插圖下方的格子；拖到已有名稱的格子會互換，也可以拖回下方。未按按鈕前不顯示對錯。"; // 設定完整玩法說明
const SCENE_TIME = 7200; // 設定自然背景場景的停留時間
const TRANSITION_TIME = 1900; // 設定自然背景的平滑漸變時間
const SCENE_NAMES = ["forest", "grassland", "snowfield", "desert", "rainforest", "coast"]; // 定義六種動物主題自然場景
let quiz = null; // 儲存目前測驗狀態
let layoutData = null; // 儲存響應式版面資料
let dragging = null; // 儲存目前被拖曳的名稱
let beganAt = 0; // 儲存本回合開始時間
let confetti = []; // 儲存高分彩帶粒子
let currentScene = 0; // 儲存目前自然場景索引
let nextScene = 1; // 儲存下一個自然場景索引
let sceneBlend = 0; // 儲存場景交叉淡化進度
let sceneStartedAt = 0; // 儲存目前場景開始時間

 // 完成初始化

 // 完成每幀繪製

 // 完成視窗尺寸處理

 // 完成滑鼠按下處理

 // 完成滑鼠拖曳處理

 // 完成滑鼠放開處理

function touchStarted() { // 處理觸控按下事件
  return mousePressed(); // 共用滑鼠按下邏輯
} // 完成觸控按下處理

function touchMoved() { // 處理觸控移動事件
  return mouseDragged(); // 共用滑鼠拖曳邏輯
} // 完成觸控移動處理

function touchEnded() { // 處理觸控結束事件
  return mouseReleased(); // 共用滑鼠放開邏輯
} // 完成觸控結束處理

function createQuiz() { // 建立一回合新的六題動物測驗
  const selected = shuffleArray(ANIMAL_TYPES).slice(0, 6); // 從十二種動物隨機抽出六種
  const cards = selected.map((item) => ({ key: item.key, name: item.name, color: item.color })); // 建立六張動物圖卡資料
  const labels = shuffleArray(cards.map((card) => ({ key: card.key, name: card.name, color: card.color }))); // 打亂六個名稱標籤順序
  return { cards: cards, labels: labels, slots: [null, null, null, null, null, null], showAnswer: false, submitted: false, correct: 0, score: 0, elapsed: 0 }; // 回傳完整測驗狀態
} // 完成新測驗建立

function resetQuiz() { // 重新出題並解鎖整個測驗
  quiz = createQuiz(); // 建立新的隨機題目
  beganAt = millis(); // 重新記錄作答開始時間
  dragging = null; // 清除殘留拖曳狀態
  confetti = []; // 清除上一回合彩帶
  refreshCanvasSize(); // 重新計算版面
} // 完成重新出題

 // 完成版面尺寸計算

 // 完成互動版面建立

function refreshCanvasSize() { // 重新計算滿版畫布內的互動位置
  layoutData = calculateLayout(); // 依目前視窗尺寸更新布局
} // 完成畫布尺寸更新

 // 完成標題與玩法說明繪製

function wrapChineseText(value, maxWidth) { // 將繁體中文說明依像素寬度換行
  const lines = []; // 建立文字行陣列
  let current = ""; // 儲存目前組合中的文字行
  for (const character of value) { // 逐字處理中文與標點
    const candidate = current + character; // 組合下一個字元
    if (current !== "" && textWidth(candidate) > maxWidth) { lines.push(current); current = character; } else { current = candidate; } // 超過寬度時換行
  } // 完成逐字換行
  if (current !== "") lines.push(current); // 將最後一行加入陣列
  return lines; // 回傳可繪製的文字行
} // 完成中文換行

 // 完成六張卡片繪製

 // 完成單張動物卡片繪製

function getSlotBox(cardBox) { // 計算卡片底部名稱放置格位置
  const slotH = Math.max(24, Math.min(37, cardBox.h * 0.23)); // 依卡片高度計算名稱格高度
  return { x: cardBox.x + 6, y: cardBox.y + cardBox.h - slotH - 7, w: cardBox.w - 12, h: slotH }; // 回傳名稱格互動矩形
} // 完成名稱格位置計算

function drawAnimalArt(key, box, baseColor) { // 繪製具有底色的純 Canvas 動物插圖區
  const backgrounds = { cat: "#fff0d5", dog: "#f5e1c8", rabbit: "#fbe4ef", elephant: "#e5edf1", lion: "#fff0b8", panda: "#eaf5f4", penguin: "#dcefff", giraffe: "#fff1bf", fox: "#ffe1c2", frog: "#dcf4c7", monkey: "#eed7bd", tiger: "#ffe0a6" }; // 定義每種動物的插圖底色
  noStroke(); // 移除插圖區外框
  fill(backgrounds[key] || "#e8f3e8"); // 填入動物插圖柔和背景
  rect(box.x, box.y, box.w, box.h, 11); // 繪製插圖區圓角底板
  push(); // 保存動物插圖狀態
  translate(box.x + box.w / 2, box.y + box.h * 0.49); // 將動物原點移到插圖中央
  const size = Math.min(box.w, box.h) * 0.95; // 依插圖區尺寸計算動物大小
  if (key === "cat") drawCat(size, baseColor); // 繪製貓向量插圖
  else if (key === "dog") drawDog(size, baseColor); // 繪製狗向量插圖
  else if (key === "rabbit") drawRabbit(size, baseColor); // 繪製兔子向量插圖
  else if (key === "elephant") drawElephant(size, baseColor); // 繪製大象向量插圖
  else if (key === "lion") drawLion(size, baseColor); // 繪製獅子向量插圖
  else if (key === "panda") drawPanda(size, baseColor); // 繪製熊貓向量插圖
  else if (key === "penguin") drawPenguin(size, baseColor); // 繪製企鵝向量插圖
  else if (key === "giraffe") drawGiraffe(size, baseColor); // 繪製長頸鹿向量插圖
  else if (key === "fox") drawFox(size, baseColor); // 繪製狐狸向量插圖
  else if (key === "frog") drawFrog(size, baseColor); // 繪製青蛙向量插圖
  else if (key === "monkey") drawMonkey(size, baseColor); // 繪製猴子向量插圖
  else drawTiger(size, baseColor); // 繪製老虎向量插圖
  pop(); // 還原動物插圖座標狀態
} // 完成動物插圖區繪製

function drawFaceEyes(size, eyeY, eyeGap) { // 繪製通用動物眼睛
  noStroke(); // 移除眼睛外框
  fill("#18324a"); // 設定眼睛顏色
  ellipse(-eyeGap, eyeY, size * 0.09, size * 0.12); // 繪製左眼
  ellipse(eyeGap, eyeY, size * 0.09, size * 0.12); // 繪製右眼
  fill(255); // 設定眼睛亮點顏色
  ellipse(-eyeGap + size * 0.015, eyeY - size * 0.02, size * 0.025, size * 0.03); // 繪製左眼亮點
  ellipse(eyeGap + size * 0.015, eyeY - size * 0.02, size * 0.025, size * 0.03); // 繪製右眼亮點
} // 完成通用眼睛

function drawCat(size, colorValue) { // 繪製貓咪向量插圖
  noStroke(); // 移除貓咪外框
  fill(colorValue); // 填入貓咪毛色
  triangle(-size * 0.42, -size * 0.27, -size * 0.27, -size * 0.61, -size * 0.03, -size * 0.34); // 繪製左耳
  triangle(size * 0.42, -size * 0.27, size * 0.27, -size * 0.61, size * 0.03, -size * 0.34); // 繪製右耳
  ellipse(0, 0, size * 0.78, size * 0.68); // 繪製貓咪臉部
  fill("#f7b2c4"); // 設定貓耳內與鼻子顏色
  triangle(-size * 0.31, -size * 0.38, -size * 0.27, -size * 0.52, -size * 0.16, -size * 0.38); // 繪製左耳內側
  triangle(size * 0.31, -size * 0.38, size * 0.27, -size * 0.52, size * 0.16, -size * 0.38); // 繪製右耳內側
  drawFaceEyes(size, -size * 0.08, size * 0.16); // 繪製貓咪眼睛
  fill("#e76f91"); // 設定貓咪鼻子顏色
  triangle(-size * 0.045, size * 0.08, size * 0.045, size * 0.08, 0, size * 0.16); // 繪製貓咪鼻子
  stroke("#8d5524"); // 設定貓咪鬍鬚顏色
  strokeWeight(Math.max(1, size * 0.025)); // 設定鬍鬚線寬
  line(-size * 0.15, size * 0.13, -size * 0.46, size * 0.08); // 繪製左上鬍鬚
  line(-size * 0.15, size * 0.2, -size * 0.46, size * 0.23); // 繪製左下鬍鬚
  line(size * 0.15, size * 0.13, size * 0.46, size * 0.08); // 繪製右上鬍鬚
  line(size * 0.15, size * 0.2, size * 0.46, size * 0.23); // 繪製右下鬍鬚
} // 完成貓咪插圖

function drawDog(size, colorValue) { // 繪製狗狗向量插圖
  noStroke(); // 移除狗狗外框
  fill("#754f35"); // 設定狗狗耳朵顏色
  ellipse(-size * 0.36, -size * 0.08, size * 0.28, size * 0.62); // 繪製左垂耳
  ellipse(size * 0.36, -size * 0.08, size * 0.28, size * 0.62); // 繪製右垂耳
  fill(colorValue); // 填入狗狗臉部毛色
  ellipse(0, 0, size * 0.78, size * 0.72); // 繪製狗狗臉部
  fill("#f4d8b4"); // 設定狗狗嘴部顏色
  ellipse(0, size * 0.19, size * 0.38, size * 0.26); // 繪製狗狗嘴部
  drawFaceEyes(size, -size * 0.08, size * 0.16); // 繪製狗狗眼睛
  fill("#30231d"); // 設定狗狗鼻子顏色
  ellipse(0, size * 0.12, size * 0.13, size * 0.1); // 繪製狗狗鼻子
  stroke("#30231d"); // 設定狗狗嘴線色彩
  strokeWeight(Math.max(1, size * 0.025)); // 設定狗狗嘴線寬度
  line(0, size * 0.16, 0, size * 0.25); // 繪製狗狗鼻下線
  arc(-size * 0.08, size * 0.22, size * 0.16, size * 0.12, 0, PI); // 繪製左側嘴角
  arc(size * 0.08, size * 0.22, size * 0.16, size * 0.12, 0, PI); // 繪製右側嘴角
} // 完成狗狗插圖

function drawRabbit(size, colorValue) { // 繪製兔子向量插圖
  noStroke(); // 移除兔子外框
  fill(colorValue); // 填入兔子毛色
  ellipse(-size * 0.2, -size * 0.56, size * 0.2, size * 0.58); // 繪製左長耳
  ellipse(size * 0.2, -size * 0.56, size * 0.2, size * 0.58); // 繪製右長耳
  fill("#efa8c6"); // 設定兔子耳朵內側顏色
  ellipse(-size * 0.2, -size * 0.56, size * 0.09, size * 0.39); // 繪製左耳內側
  ellipse(size * 0.2, -size * 0.56, size * 0.09, size * 0.39); // 繪製右耳內側
  fill(colorValue); // 恢復兔子臉部毛色
  ellipse(0, size * 0.02, size * 0.78, size * 0.66); // 繪製兔子臉部
  drawFaceEyes(size, -size * 0.06, size * 0.16); // 繪製兔子眼睛
  fill("#e76f91"); // 設定兔子鼻子顏色
  triangle(-size * 0.05, size * 0.1, size * 0.05, size * 0.1, 0, size * 0.18); // 繪製兔子鼻子
  noFill(); // 將兔子嘴巴設為線條
  stroke("#8d5524"); // 設定兔子嘴線色彩
  strokeWeight(Math.max(1, size * 0.022)); // 設定兔子嘴線寬度
  arc(-size * 0.07, size * 0.19, size * 0.14, size * 0.12, 0, PI); // 繪製左嘴角
  arc(size * 0.07, size * 0.19, size * 0.14, size * 0.12, 0, PI); // 繪製右嘴角
} // 完成兔子插圖

function drawElephant(size, colorValue) { // 繪製大象向量插圖
  noStroke(); // 移除大象外框
  fill(colorValue); // 填入大象灰色
  ellipse(-size * 0.35, -size * 0.02, size * 0.32, size * 0.58); // 繪製左大耳朵
  ellipse(size * 0.35, -size * 0.02, size * 0.32, size * 0.58); // 繪製右大耳朵
  fill("#b8c2cc"); // 設定耳朵內側顏色
  ellipse(-size * 0.35, -size * 0.02, size * 0.18, size * 0.38); // 繪製左耳內側
  ellipse(size * 0.35, -size * 0.02, size * 0.18, size * 0.38); // 繪製右耳內側
  fill(colorValue); // 恢復大象臉部顏色
  ellipse(0, -size * 0.02, size * 0.72, size * 0.7); // 繪製大象臉部
  drawFaceEyes(size, -size * 0.12, size * 0.16); // 繪製大象眼睛
  stroke(colorValue); // 設定象鼻顏色
  strokeWeight(Math.max(7, size * 0.13)); // 設定象鼻線寬
  noFill(); // 將象鼻設定為線條
  arc(0, size * 0.12, size * 0.3, size * 0.48, 0, PI); // 繪製彎曲象鼻
  noStroke(); // 移除象鼻外框
} // 完成大象插圖

function drawLion(size, colorValue) { // 繪製獅子向量插圖
  noStroke(); // 移除獅子外框
  fill("#c8872f"); // 設定獅子鬃毛顏色
  ellipse(0, 0, size * 0.95, size * 0.9); // 繪製獅子鬃毛
  fill(colorValue); // 填入獅子臉部毛色
  ellipse(0, size * 0.02, size * 0.64, size * 0.63); // 繪製獅子臉部
  drawFaceEyes(size, -size * 0.08, size * 0.14); // 繪製獅子眼睛
  fill("#704214"); // 設定獅子鼻子顏色
  triangle(-size * 0.05, size * 0.1, size * 0.05, size * 0.1, 0, size * 0.17); // 繪製獅子鼻子
  stroke("#704214"); // 設定獅子嘴巴色彩
  strokeWeight(Math.max(1, size * 0.025)); // 設定獅子嘴巴線寬
  line(0, size * 0.16, 0, size * 0.26); // 繪製獅子鼻下線
  arc(-size * 0.08, size * 0.23, size * 0.15, size * 0.12, 0, PI); // 繪製左嘴角
  arc(size * 0.08, size * 0.23, size * 0.15, size * 0.12, 0, PI); // 繪製右嘴角
} // 完成獅子插圖

function drawPanda(size, colorValue) { // 繪製熊貓向量插圖
  noStroke(); // 移除熊貓外框
  fill("#20252b"); // 設定熊貓黑色耳朵
  ellipse(-size * 0.28, -size * 0.32, size * 0.25, size * 0.25); // 繪製左耳
  ellipse(size * 0.28, -size * 0.32, size * 0.25, size * 0.25); // 繪製右耳
  fill(colorValue); // 填入熊貓臉部白色
  ellipse(0, 0, size * 0.82, size * 0.75); // 繪製熊貓臉部
  fill("#20252b"); // 設定熊貓眼罩顏色
  ellipse(-size * 0.18, -size * 0.08, size * 0.22, size * 0.3); // 繪製左眼罩
  ellipse(size * 0.18, -size * 0.08, size * 0.22, size * 0.3); // 繪製右眼罩
  fill("#ffffff"); // 設定熊貓眼睛亮色
  ellipse(-size * 0.18, -size * 0.08, size * 0.08, size * 0.1); // 繪製左眼
  ellipse(size * 0.18, -size * 0.08, size * 0.08, size * 0.1); // 繪製右眼
  fill("#20252b"); // 設定熊貓鼻子顏色
  ellipse(0, size * 0.14, size * 0.12, size * 0.09); // 繪製熊貓鼻子
} // 完成熊貓插圖

function drawPenguin(size, colorValue) { // 繪製企鵝向量插圖
  noStroke(); // 移除企鵝外框
  fill("#25364d"); // 設定企鵝身體深色
  ellipse(0, size * 0.04, size * 0.66, size * 0.9); // 繪製企鵝身體
  fill(colorValue); // 填入企鵝肚子淺色
  ellipse(0, size * 0.13, size * 0.42, size * 0.61); // 繪製企鵝肚子
  fill("#f2c14e"); // 設定企鵝嘴巴與腳色彩
  triangle(-size * 0.08, -size * 0.18, size * 0.08, -size * 0.18, 0, -size * 0.05); // 繪製企鵝嘴巴
  ellipse(-size * 0.15, size * 0.48, size * 0.18, size * 0.08); // 繪製左腳
  ellipse(size * 0.15, size * 0.48, size * 0.18, size * 0.08); // 繪製右腳
  drawFaceEyes(size, -size * 0.28, size * 0.13); // 繪製企鵝眼睛
} // 完成企鵝插圖

function drawGiraffe(size, colorValue) { // 繪製長頸鹿向量插圖
  noStroke(); // 移除長頸鹿外框
  fill(colorValue); // 填入長頸鹿黃色
  rect(-size * 0.16, -size * 0.62, size * 0.32, size * 0.72, size * 0.08); // 繪製長頸鹿長脖子
  fill("#8c5a2b"); // 設定長頸鹿斑紋顏色
  ellipse(-size * 0.08, -size * 0.43, size * 0.1, size * 0.12); // 繪製脖子左斑紋
  ellipse(size * 0.08, -size * 0.2, size * 0.1, size * 0.13); // 繪製脖子右斑紋
  ellipse(-size * 0.08, -size * 0.05, size * 0.09, size * 0.12); // 繪製脖子下斑紋
  fill(colorValue); // 恢復長頸鹿臉部黃色
  ellipse(0, -size * 0.69, size * 0.56, size * 0.4); // 繪製長頸鹿頭部
  stroke("#8c5a2b"); // 設定長頸鹿角線色彩
  strokeWeight(Math.max(2, size * 0.025)); // 設定長頸鹿角線寬
  line(-size * 0.16, -size * 0.84, -size * 0.19, -size * 0.98); // 繪製左角
  line(size * 0.16, -size * 0.84, size * 0.19, -size * 0.98); // 繪製右角
  noStroke(); // 移除臉部外框
  fill("#8c5a2b"); // 設定臉部斑紋色彩
  ellipse(-size * 0.17, -size * 0.71, size * 0.1, size * 0.1); // 繪製左臉斑紋
  ellipse(size * 0.15, -size * 0.63, size * 0.1, size * 0.1); // 繪製右臉斑紋
  drawFaceEyes(size, -size * 0.73, size * 0.14); // 繪製長頸鹿眼睛
  fill("#704214"); // 設定長頸鹿鼻子色彩
  ellipse(0, -size * 0.58, size * 0.14, size * 0.07); // 繪製長頸鹿鼻子
} // 完成長頸鹿插圖

function drawFox(size, colorValue) { // 繪製狐狸向量插圖
  noStroke(); // 移除狐狸外框
  fill(colorValue); // 填入狐狸橘色
  triangle(-size * 0.43, -size * 0.2, -size * 0.28, -size * 0.64, -size * 0.04, -size * 0.35); // 繪製左耳
  triangle(size * 0.43, -size * 0.2, size * 0.28, -size * 0.64, size * 0.04, -size * 0.35); // 繪製右耳
  ellipse(0, 0, size * 0.78, size * 0.72); // 繪製狐狸臉部
  fill("#fff4df"); // 設定狐狸臉部白色區域
  triangle(-size * 0.3, size * 0.03, 0, size * 0.38, size * 0.3, size * 0.03); // 繪製狐狸白色口鼻
  drawFaceEyes(size, -size * 0.11, size * 0.16); // 繪製狐狸眼睛
  fill("#30231d"); // 設定狐狸鼻子色彩
  triangle(-size * 0.06, size * 0.18, size * 0.06, size * 0.18, 0, size * 0.25); // 繪製狐狸鼻子
} // 完成狐狸插圖

function drawFrog(size, colorValue) { // 繪製青蛙向量插圖
  noStroke(); // 移除青蛙外框
  fill(colorValue); // 填入青蛙綠色
  ellipse(-size * 0.24, -size * 0.29, size * 0.3, size * 0.3); // 繪製左眼球
  ellipse(size * 0.24, -size * 0.29, size * 0.3, size * 0.3); // 繪製右眼球
  ellipse(0, size * 0.05, size * 0.82, size * 0.62); // 繪製青蛙臉部
  fill("#f7fff2"); // 設定青蛙眼白
  ellipse(-size * 0.24, -size * 0.3, size * 0.14, size * 0.14); // 繪製左眼白
  ellipse(size * 0.24, -size * 0.3, size * 0.14, size * 0.14); // 繪製右眼白
  fill("#18324a"); // 設定青蛙瞳孔色彩
  ellipse(-size * 0.24, -size * 0.3, size * 0.06, size * 0.08); // 繪製左瞳孔
  ellipse(size * 0.24, -size * 0.3, size * 0.06, size * 0.08); // 繪製右瞳孔
  noFill(); // 將青蛙嘴巴設定為線條
  stroke("#27632a"); // 設定青蛙嘴巴色彩
  strokeWeight(Math.max(2, size * 0.025)); // 設定青蛙嘴巴線寬
  arc(0, size * 0.08, size * 0.45, size * 0.24, 0, PI); // 繪製青蛙微笑
} // 完成青蛙插圖

function drawMonkey(size, colorValue) { // 繪製猴子向量插圖
  noStroke(); // 移除猴子外框
  fill("#d7a77d"); // 設定猴子耳朵內側顏色
  ellipse(-size * 0.42, -size * 0.02, size * 0.3, size * 0.38); // 繪製左耳
  ellipse(size * 0.42, -size * 0.02, size * 0.3, size * 0.38); // 繪製右耳
  fill(colorValue); // 填入猴子臉部棕色
  ellipse(0, -size * 0.02, size * 0.78, size * 0.72); // 繪製猴子頭部
  fill("#f0c9a0"); // 設定猴子嘴部淺色
  ellipse(0, size * 0.17, size * 0.45, size * 0.31); // 繪製猴子嘴部
  drawFaceEyes(size, -size * 0.1, size * 0.16); // 繪製猴子眼睛
  fill("#5a3825"); // 設定猴子鼻子色彩
  ellipse(0, size * 0.1, size * 0.1, size * 0.08); // 繪製猴子鼻子
  noFill(); // 將猴子嘴巴設定為線條
  stroke("#5a3825"); // 設定猴子嘴線色彩
  strokeWeight(Math.max(1, size * 0.022)); // 設定猴子嘴線寬度
  arc(0, size * 0.2, size * 0.2, size * 0.12, 0, PI); // 繪製猴子嘴巴
} // 完成猴子插圖

function drawTiger(size, colorValue) { // 繪製老虎向量插圖
  noStroke(); // 移除老虎外框
  fill(colorValue); // 填入老虎橘色
  triangle(-size * 0.42, -size * 0.25, -size * 0.3, -size * 0.58, -size * 0.08, -size * 0.35); // 繪製左耳
  triangle(size * 0.42, -size * 0.25, size * 0.3, -size * 0.58, size * 0.08, -size * 0.35); // 繪製右耳
  ellipse(0, 0, size * 0.8, size * 0.72); // 繪製老虎臉部
  fill("#3d2b1f"); // 設定老虎條紋色彩
  triangle(-size * 0.22, -size * 0.35, -size * 0.13, -size * 0.1, -size * 0.06, -size * 0.35); // 繪製左額條紋
  triangle(size * 0.22, -size * 0.35, size * 0.13, -size * 0.1, size * 0.06, -size * 0.35); // 繪製右額條紋
  triangle(-size * 0.36, size * 0.02, -size * 0.2, size * 0.05, -size * 0.32, size * 0.17); // 繪製左臉條紋
  triangle(size * 0.36, size * 0.02, size * 0.2, size * 0.05, size * 0.32, size * 0.17); // 繪製右臉條紋
  drawFaceEyes(size, -size * 0.1, size * 0.16); // 繪製老虎眼睛
  fill("#e76f91"); // 設定老虎鼻子顏色
  triangle(-size * 0.05, size * 0.11, size * 0.05, size * 0.11, 0, size * 0.19); // 繪製老虎鼻子
} // 完成老虎插圖

 // 完成正誤提示繪製

 // 完成名稱區繪製

 // 完成單一名稱標籤繪製

 // 完成拖曳標籤繪製

 // 完成主要按鈕繪製

 // 完成單一按鈕繪製

 // 完成交卷結果繪製

 // 完成拖曳開始

 // 完成名稱放入答案格

function returnToTray() { // 將名稱拖回下方名稱區
  if (dragging !== null && dragging.source === "slot") quiz.slots[dragging.sourceSlot] = null; // 從答案格拖回時保持來源格清空
} // 完成拖回名稱區

function restoreDrag() { // 將未成功放置的名稱復原
  if (dragging !== null && dragging.source === "slot") quiz.slots[dragging.sourceSlot] = dragging.labelId; // 從答案格拖出失敗時放回原格
} // 完成拖曳復原

function isPlaced(labelId) { // 判斷名稱是否已放入任一答案格
  return quiz.slots.indexOf(labelId) >= 0; // 回傳名稱放置狀態
} // 完成名稱放置判斷

function hitSlot(x, y) { // 判斷座標命中的名稱放置格索引
  for (let i = 0; i < layoutData.cards.length; i += 1) { if (inside(x, y, getSlotBox(layoutData.cards[i]))) return i; } // 逐一檢查六個名稱格
  return -1; // 沒有命中時回傳無效索引
} // 完成名稱格命中測試

function hitTrayLabel(x, y) { // 判斷座標命中的下方名稱標籤索引
  for (let i = 0; i < layoutData.tray.length; i += 1) { if (!isPlaced(i) && inside(x, y, layoutData.tray[i])) return i; } // 逐一檢查尚未放置的標籤
  return -1; // 沒有命中時回傳無效索引
} // 完成名稱標籤命中測試

function inTrayArea(x, y) { // 判斷座標是否落在下方名稱區
  const first = layoutData.tray[0]; // 取得名稱區第一格
  const last = layoutData.tray[layoutData.tray.length - 1]; // 取得名稱區最後一格
  return x >= first.x - 16 && x <= width - layoutData.metrics.margin + 16 && y >= first.y - 24 && y <= last.y + last.h + 24; // 回傳名稱區範圍結果
} // 完成名稱區判斷

 // 完成功能按鈕命中測試

function inside(x, y, box) { // 判斷座標是否位於矩形內
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h; // 回傳矩形碰撞結果
} // 完成矩形碰撞判斷

function isBrowserFullscreen() { // 讀取目前瀏覽器是否處於全螢幕模式
  return document.fullscreenElement !== null || (typeof fullscreen === "function" && fullscreen()); // 同時支援原生 API 與 p5.js 狀態
} // 完成全螢幕狀態判斷

function toggleBrowserFullscreen() { // 切換真正的瀏覽器全螢幕模式
  fullscreen(!fullscreen()); // 使用 p5.js API 切換全螢幕
} // 完成全螢幕切換

function handleFullscreenChange() { // 處理瀏覽器全螢幕狀態改變
  resizeCanvas(windowWidth, windowHeight); // 讓全螢幕切換後畫布立即更新
  refreshCanvasSize(); // 重新計算全螢幕後的版面
} // 完成全螢幕事件處理

 // 完成全螢幕按鈕繪製

function submitQuiz() { // 計算交卷成績並鎖定測驗
  if (quiz.submitted) return; // 已交卷時不重複計算
  quiz.correct = 0; // 將答對題數歸零
  quiz.cards.forEach((card, index) => { const labelId = quiz.slots[index]; if (labelId !== null && quiz.labels[labelId].key === card.key) quiz.correct += 1; }); // 逐題比對動物答案
  quiz.score = Math.round(quiz.correct / 6 * 100); // 將答對題數換算成百分比
  quiz.elapsed = Math.max(0, Math.floor((millis() - beganAt) / 1000)); // 計算作答秒數
  quiz.showAnswer = true; // 交卷後顯示每格正誤顏色
  quiz.submitted = true; // 交卷後鎖定拖曳
  if (quiz.score > 60) createConfetti(); // 分數高於百分之六十時建立彩帶
  refreshCanvasSize(); // 為成績面板重新配置版面
} // 完成交卷計算

function formatTime(seconds) { // 將秒數格式化為分鐘與秒數
  return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0"); // 回傳零補齊時間文字
} // 完成時間格式化

 // 完成彩帶建立

 // 完成彩帶繪製

function updateSceneTransition() { // 更新自然背景的交叉淡化狀態
  const elapsed = millis() - sceneStartedAt; // 計算目前場景持續時間
  if (elapsed < SCENE_TIME) { sceneBlend = 0; return; } // 停留時間未結束時保持目前場景
  sceneBlend = constrain((elapsed - SCENE_TIME) / TRANSITION_TIME, 0, 1); // 計算下一場景的淡入進度
  if (sceneBlend >= 1) { currentScene = nextScene; nextScene = (currentScene + 1) % SCENE_NAMES.length; sceneBlend = 0; sceneStartedAt = millis(); } // 漸變完成後切換場景索引
} // 完成場景漸變更新

 // 完成背景交叉淡化

function drawScene(sceneIndex, alphaValue) { // 以指定透明度繪製單一自然場景
  const sceneName = SCENE_NAMES[sceneIndex] || "forest"; // 取得安全的場景名稱
  push(); // 保存背景繪圖狀態
  drawingContext.globalAlpha = alphaValue; // 套用場景交叉淡化透明度
  drawSceneGradient(sceneName); // 繪製自然場景天空漸層
  if (sceneName === "forest") drawForestScene(); // 繪製森林場景裝飾
  if (sceneName === "grassland") drawGrasslandScene(); // 繪製草原場景裝飾
  if (sceneName === "snowfield") drawSnowfieldScene(); // 繪製雪地場景裝飾
  if (sceneName === "desert") drawDesertScene(); // 繪製沙漠場景裝飾
  if (sceneName === "rainforest") drawRainforestScene(); // 繪製雨林場景裝飾
  if (sceneName === "coast") drawCoastScene(); // 繪製海岸場景裝飾
  drawingContext.globalAlpha = 1; // 還原透明度避免影響前景
  pop(); // 還原背景繪圖狀態
} // 完成單一自然場景繪製

function drawSceneGradient(sceneName) { // 繪製六種自然場景的天空漸層
  const palettes = { forest: ["#8ed1b2", "#e8d99b"], grassland: ["#7ec8e3", "#f5d58b"], snowfield: ["#a9d9f0", "#f7fbff"], desert: ["#f6b26b", "#f9df9a"], rainforest: ["#3a9d78", "#b7d968"], coast: ["#62c4dc", "#f7d794"] }; // 定義各自然場景天空色組
  const palette = palettes[sceneName] || palettes.forest; // 取得指定場景色組
  noStroke(); // 移除天空色帶外框
  for (let y = 0; y < height; y += 12) { fill(lerpColor(color(palette[0]), color(palette[1]), y / height)); rect(0, y, width, 12); } // 以水平色帶繪製垂直漸層
} // 完成自然場景天空漸層

function drawForestScene() { // 繪製森林背景場景
  noStroke(); // 移除森林裝飾外框
  fill("#5a9b62"); // 設定森林地面顏色
  rect(0, height * 0.68, width, height * 0.32); // 繪製森林地面
  fill("#39734a"); // 設定遠方樹冠顏色
  for (let x = -40; x < width + 80; x += 100) ellipse(x, height * 0.65, 180, 130); // 繪製遠方樹冠
  fill("#6f4e37"); // 設定樹幹顏色
  for (let x = 30; x < width; x += 170) rect(x, height * 0.45, 28, height * 0.32, 8); // 繪製森林樹幹
  fill("#2f6b3d"); // 設定近景樹冠顏色
  for (let x = 0; x < width + 80; x += 170) ellipse(x, height * 0.45, 190, 145); // 繪製近景樹冠
  drawSunGlow(width * 0.86, height * 0.16, 45); // 繪製森林陽光
} // 完成森林背景

function drawGrasslandScene() { // 繪製草原背景場景
  noStroke(); // 移除草原裝飾外框
  fill("#76a84f"); // 設定草原地面顏色
  rect(0, height * 0.68, width, height * 0.32); // 繪製草原地面
  fill("#b5c96b"); // 設定遠方草坡顏色
  ellipse(width * 0.18, height * 0.74, width * 0.8, height * 0.32); // 繪製左側草坡
  ellipse(width * 0.8, height * 0.75, width * 0.9, height * 0.35); // 繪製右側草坡
  fill("#e4c35b"); // 設定小花色彩
  for (let i = 0; i < 22; i += 1) ellipse((i * 83) % width, height * 0.78 + (i % 4) * 13, 5, 5); // 繪製草地小花
  drawSunGlow(width * 0.84, height * 0.15, 48); // 繪製草原陽光
  drawSoftCloud(width * 0.18, height * 0.17, 1.1, 115); // 繪製草原雲朵
} // 完成草原背景

function drawSnowfieldScene() { // 繪製雪地背景場景
  noStroke(); // 移除雪地裝飾外框
  fill("#eaf7ff"); // 設定雪地前景顏色
  rect(0, height * 0.62, width, height * 0.38); // 繪製雪地
  fill("#c4e4f2"); // 設定雪山顏色
  triangle(0, height * 0.68, width * 0.27, height * 0.28, width * 0.55, height * 0.68); // 繪製左側雪山
  triangle(width * 0.38, height * 0.68, width * 0.7, height * 0.24, width, height * 0.68); // 繪製右側雪山
  fill(255, 255, 255, 210); // 設定雪花顏色
  for (let i = 0; i < 34; i += 1) ellipse((i * 97 + frameCount * 0.35) % width, (i * 61 + frameCount * 0.55) % height, 5, 5); // 繪製飄落雪花
} // 完成雪地背景

function drawDesertScene() { // 繪製沙漠背景場景
  noStroke(); // 移除沙漠裝飾外框
  fill("#d99b55"); // 設定沙漠地面顏色
  rect(0, height * 0.67, width, height * 0.33); // 繪製沙地
  fill("#e9b96e"); // 設定沙丘顏色
  ellipse(width * 0.2, height * 0.78, width * 0.8, height * 0.3); // 繪製左側沙丘
  ellipse(width * 0.82, height * 0.8, width * 0.85, height * 0.33); // 繪製右側沙丘
  fill("#3d8b58"); // 設定仙人掌顏色
  rect(width * 0.11, height * 0.43, 18, height * 0.28, 8); // 繪製仙人掌主幹
  rect(width * 0.06, height * 0.53, 55, 13, 7); // 繪製仙人掌左側手臂
  rect(width * 0.28, height * 0.55, 14, height * 0.18, 7); // 繪製仙人掌右側主幹
  drawSunGlow(width * 0.83, height * 0.16, 52); // 繪製沙漠烈日
} // 完成沙漠背景

function drawRainforestScene() { // 繪製雨林背景場景
  noStroke(); // 移除雨林裝飾外框
  fill("#287a50"); // 設定雨林地面顏色
  rect(0, height * 0.66, width, height * 0.34); // 繪製雨林地面
  fill("#155d3b"); // 設定遠方雨林樹冠顏色
  for (let x = -40; x < width + 60; x += 120) ellipse(x, height * 0.45, 180, 220); // 繪製雨林樹冠
  stroke("#9bd36a"); // 設定藤蔓色彩
  strokeWeight(7); // 設定藤蔓線寬
  noFill(); // 將藤蔓設為線條
  for (let x = 20; x < width; x += 120) arc(x, height * 0.35, 85, height * 0.7, 0, HALF_PI); // 繪製垂掛藤蔓
  noStroke(); // 移除雨滴外框
  fill(225, 250, 240, 100); // 設定雨林光點色彩
  for (let i = 0; i < 26; i += 1) ellipse((i * 79) % width, (i * 53) % (height * 0.75), 8, 8); // 繪製雨林光點
} // 完成雨林背景

function drawCoastScene() { // 繪製海岸背景場景
  noStroke(); // 移除海岸裝飾外框
  fill("#45a9bd"); // 設定海水顏色
  rect(0, height * 0.57, width, height * 0.43); // 繪製海面
  fill("#f7e4ae"); // 設定沙灘顏色
  rect(0, height * 0.78, width, height * 0.22); // 繪製沙灘
  stroke(255, 255, 255, 180); // 設定浪花顏色
  strokeWeight(5); // 設定浪花線寬
  noFill(); // 將浪花設為線條
  for (let y = height * 0.63; y < height * 0.77; y += 30) arc(width * 0.45, y, width * 0.7, 28, PI, TWO_PI); // 繪製海浪
  noStroke(); // 移除海岸裝飾外框
  fill("#4d8c4a"); // 設定棕櫚樹色彩
  rect(width * 0.8, height * 0.27, 18, height * 0.5, 8); // 繪製棕櫚樹樹幹
  ellipse(width * 0.81, height * 0.25, 170, 42); // 繪製棕櫚樹葉
  drawSunGlow(width * 0.18, height * 0.16, 50); // 繪製海岸陽光
} // 完成海岸背景

function drawSunGlow(x, y, size) { // 繪製柔和太陽與光暈
  noStroke(); // 移除太陽外框
  fill(255, 220, 100, 50); // 設定太陽光暈色彩
  ellipse(x, y, size * 2.4, size * 2.4); // 繪製太陽光暈
  fill(255, 213, 79, 180); // 設定太陽本體色彩
  ellipse(x, y, size, size); // 繪製太陽本體
} // 完成太陽光暈

function drawSoftCloud(x, y, scaleValue, alphaValue) { // 繪製半透明自然雲朵
  noStroke(); // 移除雲朵外框
  fill(255, 255, 255, alphaValue); // 設定雲朵透明色彩
  ellipse(x, y, 100 * scaleValue, 42 * scaleValue); // 繪製雲朵底部
  ellipse(x - 36 * scaleValue, y + 2 * scaleValue, 58 * scaleValue, 38 * scaleValue); // 繪製雲朵左側
  ellipse(x + 31 * scaleValue, y - 8 * scaleValue, 67 * scaleValue, 54 * scaleValue); // 繪製雲朵右側
  ellipse(x + 3 * scaleValue, y - 23 * scaleValue, 70 * scaleValue, 62 * scaleValue); // 繪製雲朵中央
} // 完成自然雲朵

function shuffleArray(source) { // 建立不修改來源的隨機陣列
  const result = source.slice(); // 複製來源資料
  for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); const temporary = result[i]; result[i] = result[j]; result[j] = temporary; } // 使用 Fisher-Yates 演算法打亂資料
  return result; // 回傳隨機排列結果
} // 完成隨機排列


const VISUAL_PARTICLES = []; // 儲存拖曳與答案回饋粒子
const DRAG_TRAIL = []; // 儲存名稱拖曳軌跡座標
let slotHoverIndex = -1; // 儲存目前被拖曳指向的放置格
let hoveredButton = ""; // 儲存目前滑鼠或觸控指向的按鈕
let pressedButton = ""; // 儲存目前被按下的按鈕
let lastFrameMillis = 0; // 儲存上一幀時間以控制動畫更新

function setup() { // 初始化新版全螢幕互動畫布
  document.documentElement.style.margin = "0"; // 移除網頁根元素外距
  document.documentElement.style.padding = "0"; // 移除網頁根元素內距
  document.documentElement.style.overflow = "hidden"; // 防止根元素產生捲軸
  document.body.style.margin = "0"; // 移除網頁本體外距
  document.body.style.padding = "0"; // 移除網頁本體內距
  document.body.style.overflow = "hidden"; // 防止網頁本體產生捲軸
  document.body.style.width = "100vw"; // 讓本體寬度填滿視窗
  document.body.style.height = "100vh"; // 讓本體高度填滿視窗
  pixelDensity(Math.min(2, window.devicePixelRatio || 1)); // 控制高解析度畫布效能
  const canvasElement = createCanvas(windowWidth, windowHeight); // 建立純 p5.js Canvas
  canvasElement.position(0, 0); // 將畫布貼齊視窗左上角
  canvasElement.style("display", "block"); // 移除畫布行內空白
  canvasElement.style("position", "fixed"); // 讓畫布固定在視窗中
  canvasElement.style("left", "0px"); // 設定畫布左側位置
  canvasElement.style("top", "0px"); // 設定畫布頂端位置
  canvasElement.style("z-index", "0"); // 將畫布放在最底層
  canvasElement.style("touch-action", "none"); // 允許畫布接收觸控拖曳
  canvasElement.elt.setAttribute("aria-label", "動物辨識連連看互動畫布"); // 設定畫布無障礙標籤
  textFont("Noto Sans TC, Microsoft JhengHei, sans-serif"); // 設定繁體中文優先字型
  textAlign(CENTER, CENTER); // 設定文字預設置中
  textWrap(WORD); // 開啟 p5.js 文字換行
  quiz = createQuiz(); // 建立第一回合六題資料
  beganAt = millis(); // 記錄第一回合作答起始時間
  currentScene = 0; // 初始化目前自然場景
  nextScene = 1; // 初始化下一個自然場景
  sceneBlend = 0; // 初始化場景漸變進度
  sceneStartedAt = millis(); // 記錄場景開始時間
  document.addEventListener("fullscreenchange", handleFullscreenChange); // 監聽全螢幕狀態變更
  refreshCanvasSize(); // 建立初始響應式布局
} // 完成新版初始化

function drawGameFrame() { // 每一幀繪製新版完整畫面
  const now = millis(); // 讀取目前動畫時間
  const delta = constrain(now - lastFrameMillis, 0, 50); // 限制單幀時間避免跳動
  lastFrameMillis = now; // 保存目前時間供下一幀使用
  updateSceneTransition(); // 更新自然背景平滑漸變
  updateVisualParticles(delta); // 更新答案與拖曳粒子
  updateDragTrail(delta); // 更新拖曳軌跡透明度
  hoveredButton = layoutData ? getHoveredButton(mouseX, mouseY) : ""; // 更新按鈕懸停狀態
  slotHoverIndex = dragging !== null && layoutData ? hitSlot(mouseX, mouseY) : -1; // 更新拖曳中的放置格高亮
  drawBackground(); // 繪製低對比自然背景
  drawHeader(); // 繪製標題與玩法說明
  drawCards(); // 繪製漂浮動物圖卡與放置格
  drawTray(); // 繪製可拖曳動物名稱
  drawButtons(); // 繪製互動功能按鈕
  drawResultPanel(); // 交卷後繪製卡片式成績面板
  drawAmbientForeground(); // 繪製低對比前景光點
  if (dragging !== null) drawDraggingLabel(); // 繪製跟隨指標的拖曳標籤
  drawVisualParticles(); // 繪製星光與圓點粒子
  if (quiz !== null && quiz.submitted && quiz.score > 60) drawConfetti(); // 高分時繪製彩帶慶祝
} // 完成新版每幀繪製

function windowResized() { // 處理視窗縮放與裝置旋轉
  resizeCanvas(windowWidth, windowHeight); // 讓畫布符合最新視窗尺寸
  refreshCanvasSize(); // 重新計算全部互動矩形
} // 完成響應式縮放處理

function drawHeader() { // 繪製具有玻璃擬態的標題區
  if (!layoutData) return; // 布局尚未建立時停止繪製
  const margin = layoutData.metrics.margin; // 讀取左右安全邊距
  const scale = layoutData.metrics.scale; // 讀取目前響應式縮放比例
  const titleSize = Math.max(22, Math.min(42, 34 + scale * 8)); // 計算標題字體大小
  const boxY = Math.max(47, Math.min(65, 53 + scale * 5)); // 設定玩法面板頂端
  const boxH = Math.max(30, layoutData.metrics.headerH - boxY - 7); // 設定玩法面板高度
  drawGlassPanel(margin, 8, width - margin * 2, layoutData.metrics.headerH - 12, 20, 190); // 繪製標題玻璃層
  noStroke(); // 移除標題外框
  fill(UI.navy); // 設定標題色彩
  textAlign(LEFT, TOP); // 設定標題靠左對齊
  textSize(titleSize); // 套用標題字體大小
  text("動物辨識連連看", margin + 13, 13); // 繪製遊戲標題
  fill("rgba(24,50,74,0.62)"); // 設定副標題柔和色彩
  textSize(Math.max(9, Math.min(13, 10 + scale * 2))); // 設定副標題大小
  text("觀察、拖曳、配對，讓小動物回到正確的位置", margin + 15, 17 + titleSize); // 繪製副標題
  drawFullscreenButton(layoutData.fullscreenButton); // 繪製全螢幕按鈕
  fill(255, 255, 255, 205); // 設定玩法面板半透明白色
  rect(margin + 7, boxY, width - margin * 2 - 14, boxH, 13); // 繪製玩法說明面板
  fill(UI.ink); // 設定玩法文字色彩
  textAlign(LEFT, TOP); // 設定玩法文字靠左對齊
  textSize(Math.max(9, Math.min(14, 11 + scale * 3))); // 設定玩法文字大小
  const lines = wrapChineseText(INSTRUCTION, width - margin * 2 - 34); // 依寬度切割玩法文字
  text(lines.join("\n"), margin + 17, boxY + 6, width - margin * 2 - 34, boxH - 10); // 繪製完整玩法說明
  textAlign(CENTER, CENTER); // 還原文字置中設定
} // 完成標題區繪製

function drawBackground() { // 繪製低對比且具有層次的自然背景
  drawScene(currentScene, 1); // 繪製目前自然場景
  if (sceneBlend > 0) drawScene(nextScene, sceneBlend); // 漸進繪製下一個自然場景
  noStroke(); // 移除背景柔焦層外框
  fill(255, 255, 255, 92); // 設定低對比白色柔焦層
  rect(0, 0, width, height); // 鋪設柔焦層提升文字可讀性
  fill(255, 255, 255, 27); // 設定遠景霧光色彩
  ellipse(width * 0.18, height * 0.16, width * 0.48, height * 0.24); // 繪製左上遠景霧光
  ellipse(width * 0.84, height * 0.72, width * 0.55, height * 0.26); // 繪製右下遠景霧光
} // 完成背景繪製

function drawCards() { // 繪製六張具有漂浮效果的動物卡片
  if (!quiz || !layoutData) return; // 資料尚未準備時停止繪製
  quiz.cards.forEach((card, index) => drawCard(card, layoutData.cards[index], index)); // 逐張繪製動物卡片
} // 完成卡片區繪製

function drawCard(card, box, index) { // 繪製單張帶有陰影光暈的動物卡片
  const time = millis() * 0.001; // 將動畫時間換算成秒
  const floatY = Math.sin(time * 1.25 + index * 0.83) * Math.max(1.5, box.h * 0.018); // 計算每張卡片不同漂浮位移
  const floatR = Math.sin(time * 0.8 + index * 1.17) * 0.012; // 計算每張卡片不同輕微旋轉
  const feedback = quiz.showAnswer || quiz.submitted; // 判斷是否已允許顯示正誤
  const labelId = quiz.slots[index]; // 讀取此卡片目前的名稱索引
  const correct = labelId !== null && quiz.labels[labelId].key === card.key; // 計算此卡片答案是否正確
  const shake = feedback && !correct ? Math.sin(time * 18 + index) * box.w * 0.012 : 0; // 錯誤卡片加入輕微左右晃動
  const visualBox = { x: box.x + shake, y: box.y + floatY, w: box.w, h: box.h }; // 建立動畫後的視覺卡片位置
  push(); // 保存卡片繪圖狀態
  translate(visualBox.x + visualBox.w / 2, visualBox.y + visualBox.h / 2); // 將卡片中心設為旋轉原點
  rotate(floatR); // 套用卡片輕微晃動角度
  translate(-visualBox.w / 2, -visualBox.h / 2); // 還原卡片左上角座標
  const glowColor = feedback ? (correct ? "rgba(76,175,80,0.58)" : "rgba(230,57,70,0.50)") : "rgba(255,255,255,0.48)"; // 設定卡片狀態光暈色彩
  drawingContext.shadowColor = glowColor; // 設定柔和外框光暈
  drawingContext.shadowBlur = feedback ? 22 : 15; // 設定卡片光暈強度
  drawingContext.shadowOffsetY = 8; // 設定卡片陰影垂直偏移
  noStroke(); // 移除卡片外框
  fill(255, 255, 255, 239); // 使用半透明白色繪製卡片
  rect(0, 0, visualBox.w, visualBox.h, 18); // 繪製圓角卡片底板
  drawingContext.shadowBlur = 0; // 清除卡片陰影避免影響內容
  drawingContext.shadowOffsetY = 0; // 清除卡片陰影偏移
  stroke(255, 255, 255, 220); // 設定卡片柔和外框
  strokeWeight(1.5); // 設定外框線寬
  noFill(); // 將外框設定為透明填色
  rect(1, 1, visualBox.w - 2, visualBox.h - 2, 18); // 繪製卡片外框
  const imageBox = { x: 7, y: 7, w: visualBox.w - 14, h: visualBox.h - Math.max(42, visualBox.h * 0.28) }; // 計算動物插圖區域
  noStroke(); // 移除插圖區外框
  fill(lerpColor(color(card.color), color("#ffffff"), 0.78)); // 混合柔和插圖底色
  rect(imageBox.x, imageBox.y, imageBox.w, imageBox.h, 14); // 繪製插圖圓角底板
  push(); // 保存動物插圖狀態
  translate(imageBox.x + imageBox.w / 2, imageBox.y + imageBox.h * 0.51); // 將動物移到插圖中心
  const artSize = Math.min(imageBox.w, imageBox.h) * 0.94; // 計算動物插圖大小
  const breathe = 1 + Math.sin(time * 2.1 + index * 0.66) * 0.018; // 計算動物呼吸縮放效果
  const sway = Math.sin(time * 1.55 + index * 0.9) * 0.025; // 計算動物左右晃動效果
  scale(breathe); // 套用動物呼吸縮放
  rotate(sway); // 套用動物細微晃動
  drawAnimalArt(card.key, { x: -imageBox.w / 2, y: -imageBox.h * 0.51, w: imageBox.w, h: imageBox.h }, card.color); // 繪製純 Canvas 動物插圖
  pop(); // 還原動物插圖狀態
  pop(); // 還原卡片繪圖狀態
  drawCardSlot(card, box, index, labelId, correct, floatY, floatR, feedback); // 繪製卡片下方放置格
} // 完成動物卡片繪製

function drawCardSlot(card, box, index, labelId, correct, floatY, floatR, feedback) { // 繪製帶有高亮反應的名稱放置格
  const slot = getSlotBox(box); // 取得原始放置格位置
  const time = millis() * 0.001; // 讀取放置格動畫時間
  const hover = slotHoverIndex === index; // 判斷目前是否指向此放置格
  const slotY = slot.y + floatY; // 讓放置格與卡片同步漂浮
  const slotScale = hover ? 1.035 : 1; // 計算被指向時的放大比例
  const slotCX = slot.x + slot.w / 2; // 計算放置格中心水平位置
  const slotCY = slotY + slot.h / 2; // 計算放置格中心垂直位置
  const slotColor = feedback ? (correct ? "rgba(167,201,87,0.90)" : "rgba(230,57,70,0.86)") : "rgba(247,251,253,0.92)"; // 設定放置格狀態底色
  push(); // 保存放置格繪圖狀態
  translate(slotCX, slotCY); // 將放置格中心設為縮放原點
  rotate(floatR); // 與卡片保持相同旋轉角度
  scale(slotScale); // 套用指向時放大效果
  drawingContext.shadowColor = hover ? "rgba(255,202,58,0.82)" : "rgba(24,50,74,0.12)"; // 設定放置格光暈色彩
  drawingContext.shadowBlur = hover ? 19 : 5; // 設定放置格陰影或光暈強度
  noStroke(); // 移除放置格外框
  fill(slotColor); // 填入放置格狀態顏色
  rect(-slot.w / 2, -slot.h / 2, slot.w, slot.h, 11); // 繪製圓角放置格
  drawingContext.shadowBlur = 0; // 清除放置格陰影
  stroke(255, 255, 255, hover ? 245 : 170); // 設定放置格玻璃外框
  strokeWeight(hover ? 2.4 : 1.2); // 設定放置格外框寬度
  noFill(); // 將外框設定為透明填色
  rect(-slot.w / 2, -slot.h / 2, slot.w, slot.h, 11); // 繪製放置格外框
  noStroke(); // 移除文字外框
  fill(feedback ? 255 : UI.ink); // 設定放置格文字色彩
  textSize(Math.max(10, Math.min(18, box.w * 0.085))); // 依卡片寬度設定文字大小
  const slotText = labelId === null ? (box.w < 125 ? "放名稱" : "拖名稱到這裡") : quiz.labels[labelId].name; // 組合放置格顯示文字
  text(slotText, 0, 0); // 繪製放置格文字
  pop(); // 還原放置格繪圖狀態
  if (feedback) drawCorrectMark(correct, box, floatY, floatR); // 只有查看答案或交卷後顯示正誤
} // 完成放置格繪製

function drawCorrectMark(correct, box, floatY = 0, floatR = 0) { // 繪製帶有光暈的正確或錯誤提示
  push(); // 保存提示繪圖狀態
  translate(box.x + box.w / 2, box.y + floatY + 15); // 將提示移到卡片上方
  rotate(floatR); // 讓提示與卡片保持一致角度
  drawingContext.shadowColor = correct ? "rgba(56,102,65,0.48)" : "rgba(157,28,43,0.42)"; // 設定提示陰影色彩
  drawingContext.shadowBlur = 8; // 設定提示陰影模糊程度
  fill(correct ? "#386641" : "#9d1c2b"); // 設定正確或錯誤文字色彩
  textSize(Math.max(10, Math.min(15, box.w * 0.07))); // 依卡片寬度設定提示文字大小
  text(correct ? "✓ 正確" : "✕ 錯誤", 0, 0); // 繪製正誤文字
  drawingContext.shadowBlur = 0; // 清除提示陰影
  pop(); // 還原提示繪圖狀態
} // 完成正誤提示繪製

function drawTray() { // 繪製具有玻璃底板的名稱區
  if (!quiz || !layoutData) return; // 資料尚未準備時停止繪製
  const trayTop = layoutData.tray[0].y; // 讀取名稱區頂端位置
  const panelY = trayTop - 28; // 計算名稱區玻璃面板頂端
  const panelH = layoutData.metrics.trayRows * (layoutData.metrics.trayH + layoutData.metrics.gap) + 17; // 計算名稱區玻璃面板高度
  drawGlassPanel(layoutData.metrics.margin - 7, panelY, width - layoutData.metrics.margin * 2 + 14, panelH, 18, 120); // 繪製名稱區玻璃面板
  noStroke(); // 移除區域標題外框
  fill(UI.navy); // 設定名稱區標題色彩
  textAlign(LEFT, CENTER); // 設定區域標題靠左對齊
  textSize(Math.max(12, Math.min(17, 13 + layoutData.metrics.scale * 3))); // 設定區域標題文字大小
  text("可拖曳的動物名稱", layoutData.metrics.margin + 4, trayTop - 17); // 繪製名稱區標題
  textAlign(CENTER, CENTER); // 還原文字置中設定
  quiz.labels.forEach((label, index) => { if (!isPlaced(index) && (dragging === null || dragging.labelId !== index)) drawLabel(label, layoutData.tray[index], false, index); }); // 只繪製尚未放置的名稱
} // 完成名稱區繪製

function drawLabel(label, box, active, labelIndex = -1) { // 繪製帶有互動光影的名稱標籤
  const hovering = !active && labelIndex >= 0 && inside(mouseX, mouseY, box); // 判斷名稱標籤是否被指向
  const lift = active ? -3 : hovering ? -1.5 : 0; // 計算名稱標籤上浮距離
  const scaleValue = active ? 1.10 : hovering ? 1.025 : 1; // 計算名稱標籤縮放比例
  const drawW = box.w * scaleValue; // 計算繪製寬度
  const drawH = box.h * scaleValue; // 計算繪製高度
  push(); // 保存名稱標籤繪圖狀態
  translate(box.x + box.w / 2, box.y + box.h / 2 + lift); // 將標籤中心設為原點
  drawingContext.shadowColor = active ? "rgba(23,105,170,0.46)" : hovering ? "rgba(255,202,58,0.42)" : "rgba(24,50,74,0.16)"; // 設定標籤陰影色彩
  drawingContext.shadowBlur = active ? 18 : hovering ? 12 : 7; // 設定標籤陰影強度
  drawingContext.shadowOffsetY = active ? 7 : 3; // 設定標籤陰影偏移
  noStroke(); // 移除標籤外框
  fill(active ? "rgba(255,241,184,0.88)" : hovering ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.90)"); // 設定標籤玻璃底色
  rect(-drawW / 2, -drawH / 2, drawW, drawH, 13); // 繪製圓角名稱標籤
  drawingContext.shadowBlur = 0; // 清除標籤陰影
  drawingContext.shadowOffsetY = 0; // 清除標籤陰影偏移
  stroke(active ? UI.gold : "rgba(255,255,255,0.86)"); // 設定標籤外框色彩
  strokeWeight(active ? 2.4 : 1.4); // 設定標籤外框寬度
  noFill(); // 將標籤外框設定為透明填色
  rect(-drawW / 2, -drawH / 2, drawW, drawH, 13); // 繪製標籤外框
  noStroke(); // 移除文字外框
  fill(UI.ink); // 設定名稱文字色彩
  textSize(Math.max(13, Math.min(20, box.w * 0.11))); // 依標籤寬度調整文字大小
  text(label.name, 0, 0); // 繪製動物名稱
  pop(); // 還原名稱標籤繪圖狀態
} // 完成名稱標籤繪製

function drawDraggingLabel() { // 繪製具有半透明預覽與拖曳軌跡的名稱
  if (!dragging || !quiz || !layoutData) return; // 沒有拖曳資料時停止繪製
  drawDragTrail(); // 先繪製淡淡的拖曳軌跡
  const label = quiz.labels[dragging.labelId]; // 讀取目前拖曳名稱
  const dragW = Math.min(230, width - layoutData.metrics.margin * 2); // 計算拖曳標籤最大寬度
  const dragH = Math.max(38, Math.min(58, 43 + layoutData.metrics.scale * 10)); // 計算拖曳標籤高度
  const preview = { x: dragging.x - dragW / 2, y: dragging.y - dragH / 2 + 5, w: dragW, h: dragH }; // 建立半透明拖曳預覽位置
  push(); // 保存拖曳預覽繪圖狀態
  drawingContext.globalAlpha = 0.28; // 設定預覽半透明程度
  drawLabel(label, { x: preview.x + 7, y: preview.y + 10, w: preview.w, h: preview.h }, true, -1); // 繪製偏移的拖曳陰影預覽
  drawingContext.globalAlpha = 1; // 還原繪圖透明度
  drawLabel(label, preview, true, -1); // 繪製滑鼠或手指跟隨標籤
  pop(); // 還原拖曳預覽繪圖狀態
} // 完成拖曳名稱繪製

 // 完成功能按鈕繪製

 // 完成單一按鈕繪製

function drawFullscreenButton(box) { // 繪製具有懸停效果的全螢幕按鈕
  if (!box) return; // 版面尚未建立時停止繪製
  const hovering = hoveredButton === "fullscreen"; // 判斷全螢幕按鈕是否被指向
  const label = isBrowserFullscreen() ? "退出全螢幕" : "全螢幕"; // 依全螢幕狀態決定文字
  const scaleValue = hovering ? 1.035 : 1; // 計算懸停縮放比例
  push(); // 保存全螢幕按鈕繪圖狀態
  translate(box.x + box.w / 2, box.y + box.h / 2 - (hovering ? 1 : 0)); // 將按鈕中心設為原點
  scale(scaleValue); // 套用懸停縮放效果
  drawingContext.shadowColor = "rgba(138,90,0,0.28)"; // 設定全螢幕按鈕陰影
  drawingContext.shadowBlur = hovering ? 14 : 7; // 設定全螢幕按鈕陰影強度
  noStroke(); // 移除全螢幕按鈕外框
  fill("rgba(138,90,0,0.94)"); // 填入金棕色按鈕底色
  rect(-box.w / 2, -box.h / 2, box.w, box.h, 12); // 繪製全螢幕圓角按鈕
  drawingContext.shadowBlur = 0; // 清除全螢幕按鈕陰影
  fill(UI.white); // 設定全螢幕按鈕文字色彩
  textAlign(CENTER, CENTER); // 設定文字置中
  textSize(Math.max(11, Math.min(16, box.w * 0.1))); // 依按鈕寬度設定字體大小
  text(label, 0, 0); // 繪製全螢幕按鈕文字
  pop(); // 還原全螢幕按鈕繪圖狀態
} // 完成全螢幕按鈕繪製

function drawResultPanel() { // 繪製交卷後的卡片式成績面板
  if (!quiz || !quiz.submitted || !layoutData) return; // 未交卷前不顯示成績面板
  const margin = layoutData.metrics.margin; // 讀取成績面板左右邊距
  const panelY = layoutData.resultY; // 讀取成績面板垂直位置
  const panelW = width - margin * 2; // 計算成績面板寬度
  const panelH = layoutData.metrics.resultH; // 讀取成績面板高度
  drawGlassPanel(margin, panelY, panelW, panelH, 20, 222); // 繪製成績玻璃面板
  const scoreX = margin + Math.min(105, panelW * 0.18); // 計算分數圓心水平位置
  const scoreY = panelY + panelH * 0.5; // 計算分數圓心垂直位置
  const scoreRadius = Math.min(36, panelH * 0.34); // 計算分數圓形半徑
  noFill(); // 將分數圓環設為線條
  stroke(255, 255, 255, 110); // 設定分數圓環底色
  strokeWeight(8); // 設定分數圓環寬度
  ellipse(scoreX, scoreY, scoreRadius * 2, scoreRadius * 2); // 繪製分數圓環底圈
  stroke(quiz.score > 60 ? "#8ac926" : "#e76f51"); // 依分數設定圓環進度色彩
  strokeCap(ROUND); // 設定圓環端點圓滑
  arc(scoreX, scoreY, scoreRadius * 2, scoreRadius * 2, -HALF_PI, -HALF_PI + TWO_PI * quiz.score / 100); // 繪製分數進度圓環
  strokeCap(SQUARE); // 還原線段端點樣式
  noStroke(); // 移除分數文字外框
  fill(UI.navy); // 設定分數文字色彩
  textSize(Math.max(18, Math.min(28, scoreRadius * 0.72))); // 設定分數字體大小
  text(quiz.score + "%", scoreX, scoreY - 2); // 繪製分數百分比
  fill("rgba(24,50,74,0.64)"); // 設定分數小標色彩
  textSize(Math.max(9, Math.min(13, scoreRadius * 0.30))); // 設定分數小標大小
  text("完成度", scoreX, scoreY + scoreRadius * 0.53); // 繪製分數小標
  const infoX = scoreX + scoreRadius + Math.min(38, panelW * 0.06); // 計算成績資訊區水平位置
  textAlign(LEFT, CENTER); // 設定成績資訊靠左對齊
  fill(UI.navy); // 設定成績標題色彩
  textSize(Math.max(12, Math.min(20, panelH * 0.18))); // 設定成績標題大小
  text("本次挑戰完成！", infoX, panelY + panelH * 0.23); // 繪製成績標題
  fill("rgba(24,50,74,0.78)"); // 設定成績內容色彩
  textSize(Math.max(10, Math.min(16, panelH * 0.14))); // 設定成績內容大小
  text("答對 " + quiz.correct + "/6　用時 " + formatTime(quiz.elapsed), infoX, panelY + panelH * 0.48); // 繪製答對題數與用時
  fill(quiz.score > 60 ? "#386641" : "#9d1c2b"); // 依分數設定鼓勵字條色彩
  textSize(Math.max(11, Math.min(17, panelH * 0.15))); // 設定鼓勵字條大小
  text(quiz.score > 60 ? "太棒了！彩帶正在為你慶祝！" : "繼續努力！再試一次就會更好！", infoX, panelY + panelH * 0.75); // 繪製鼓勵字條
  textAlign(CENTER, CENTER); // 還原文字置中設定
} // 完成交卷成績面板繪製

 // 完成按下事件處理

function mouseDragged() { // 處理滑鼠或觸控拖曳移動
  if (dragging !== null && quiz && !quiz.showAnswer && !quiz.submitted) { dragging.x = mouseX; dragging.y = mouseY; DRAG_TRAIL.push({ x: mouseX, y: mouseY, life: 1 }); if (DRAG_TRAIL.length > 18) DRAG_TRAIL.shift(); } // 更新名稱位置並記錄拖曳軌跡
  return false; // 阻止瀏覽器預設拖曳行為
} // 完成拖曳移動處理

function mouseReleased() { // 處理滑鼠或觸控放開事件
  pressedButton = ""; // 清除按鈕按下狀態
  if (dragging === null) return false; // 沒有拖曳資料時停止處理
  const dropX = mouseX; // 保存放開時的水平座標
  const dropY = mouseY; // 保存放開時的垂直座標
  const slotIndex = hitSlot(dropX, dropY); // 判斷放開時命中的放置格
  if (slotIndex >= 0) { dropInSlot(slotIndex); createBurst(dropX, dropY, "#ffca3a"); } else if (inTrayArea(dropX, dropY)) returnToTray(); else restoreDrag(); // 依放開位置完成放置或復原
  dragging = null; // 清除目前拖曳資料
  DRAG_TRAIL.length = 0; // 清除拖曳軌跡資料
  return false; // 阻止瀏覽器預設放開行為
} // 完成放開事件處理

function startDrag(labelId, source, sourceSlot) { // 開始拖曳指定名稱並建立起點資料
  if (!Number.isInteger(labelId) || labelId < 0 || labelId >= quiz.labels.length) return; // 驗證名稱索引有效性
  if (source === "slot") quiz.slots[sourceSlot] = null; // 從放置格取出時先清空來源格
  dragging = { labelId: labelId, source: source, sourceSlot: sourceSlot, x: mouseX, y: mouseY }; // 儲存拖曳來源與座標
  DRAG_TRAIL.length = 0; // 清除上一段拖曳軌跡
  DRAG_TRAIL.push({ x: mouseX, y: mouseY, life: 1 }); // 記錄拖曳起點
} // 完成拖曳開始處理

function dropInSlot(targetSlot) { // 將拖曳名稱放入目標格並執行互換
  if (dragging === null || targetSlot < 0 || targetSlot >= 6) return; // 驗證拖曳資料與格子索引
  const oldLabel = quiz.slots[targetSlot]; // 讀取目標格原有名稱
  if (oldLabel !== null && dragging.source === "slot" && dragging.sourceSlot !== targetSlot) quiz.slots[dragging.sourceSlot] = oldLabel; // 從格子到格子時交換原有名稱
  quiz.slots[targetSlot] = dragging.labelId; // 將拖曳名稱放入目標格
} // 完成名稱放置處理

function drawGlassPanel(x, y, w, h, radius, alphaValue) { // 繪製低對比玻璃擬態面板
  push(); // 保存玻璃面板繪圖狀態
  drawingContext.shadowColor = "rgba(16,42,67,0.12)"; // 設定玻璃面板陰影色彩
  drawingContext.shadowBlur = 12; // 設定玻璃面板陰影模糊程度
  noStroke(); // 移除玻璃面板外框
  fill(255, 255, 255, alphaValue); // 填入半透明白色面板
  rect(x, y, w, h, radius); // 繪製圓角玻璃面板
  drawingContext.shadowBlur = 0; // 清除玻璃面板陰影
  stroke(255, 255, 255, 125); // 設定玻璃面板外框色彩
  strokeWeight(1); // 設定玻璃面板外框寬度
  noFill(); // 將外框設定為透明填色
  rect(x + 1, y + 1, w - 2, h - 2, radius); // 繪製玻璃面板外框
  pop(); // 還原玻璃面板繪圖狀態
} // 完成玻璃面板繪製

 // 完成按鈕懸停判斷

function drawDragTrail() { // 繪製名稱拖曳留下的淡淡軌跡
  noStroke(); // 移除軌跡外框
  for (let i = 0; i < DRAG_TRAIL.length; i += 1) { const point = DRAG_TRAIL[i]; const fade = point.life * (i + 1) / DRAG_TRAIL.length; fill(23, 105, 170, 38 * fade); ellipse(point.x, point.y, 6 + 12 * fade, 6 + 12 * fade); } // 依軌跡順序繪製透明圓點
} // 完成拖曳軌跡繪製

function updateDragTrail(delta) { // 更新拖曳軌跡的淡出狀態
  for (let i = DRAG_TRAIL.length - 1; i >= 0; i -= 1) { DRAG_TRAIL[i].life -= delta * 0.0018; if (DRAG_TRAIL[i].life <= 0) DRAG_TRAIL.splice(i, 1); } // 逐點降低軌跡生命值
} // 完成拖曳軌跡更新

function createBurst(x, y, burstColor) { // 在放下名稱位置建立小型星光粒子
  for (let i = 0; i < 16; i += 1) VISUAL_PARTICLES.push({ x: x, y: y, vx: Math.cos(TWO_PI * i / 16) * (0.5 + Math.random() * 1.8), vy: Math.sin(TWO_PI * i / 16) * (0.5 + Math.random() * 1.8), size: 3 + Math.random() * 4, life: 1, color: burstColor, star: i % 3 === 0 }); // 建立放置回饋粒子
} // 完成放置粒子建立

function createFeedbackBursts() { // 在查看答案後為六張卡片建立回饋粒子
  if (!layoutData || !quiz) return; // 布局或測驗資料尚未準備時停止建立粒子
  quiz.cards.forEach((card, index) => { const slot = getSlotBox(layoutData.cards[index]); const labelId = quiz.slots[index]; const correct = labelId !== null && quiz.labels[labelId].key === card.key; createBurst(slot.x + slot.w / 2, slot.y + slot.h / 2, correct ? "#8ac926" : "#e63946"); }); // 依每題正誤建立不同色彩粒子
} // 完成答案回饋粒子建立

function updateVisualParticles(delta) { // 更新星光與圓點粒子位置
  for (let i = VISUAL_PARTICLES.length - 1; i >= 0; i -= 1) { const particle = VISUAL_PARTICLES[i]; particle.x += particle.vx * delta * 0.06; particle.y += particle.vy * delta * 0.06; particle.vy += delta * 0.0014; particle.life -= delta * 0.0016; if (particle.life <= 0) VISUAL_PARTICLES.splice(i, 1); } // 更新每顆粒子的移動與生命值
} // 完成粒子更新

function drawVisualParticles() { // 繪製答案與放置回饋粒子
  noStroke(); // 移除粒子外框
  for (const particle of VISUAL_PARTICLES) { const alphaValue = 230 * particle.life; fill(red(color(particle.color)), green(color(particle.color)), blue(color(particle.color)), alphaValue); if (particle.star) { push(); translate(particle.x, particle.y); rotate(frameCount * 0.08); beginShape(); vertex(0, -particle.size); vertex(particle.size * 0.32, -particle.size * 0.32); vertex(particle.size, 0); vertex(particle.size * 0.32, particle.size * 0.32); vertex(0, particle.size); vertex(-particle.size * 0.32, particle.size * 0.32); vertex(-particle.size, 0); vertex(-particle.size * 0.32, -particle.size * 0.32); endShape(CLOSE); pop(); } else ellipse(particle.x, particle.y, particle.size, particle.size); } // 依粒子類型繪製星光或圓點
} // 完成粒子繪製

function drawAmbientForeground() { // 繪製不干擾文字的前景微光
  noStroke(); // 移除前景微光外框
  for (let i = 0; i < 12; i += 1) { const x = (i * 137 + frameCount * (0.08 + i * 0.003)) % (width + 30) - 15; const y = height * (0.12 + (i * 0.071) % 0.72); const pulse = 2 + Math.sin(frameCount * 0.035 + i) * 1.4; fill(255, 255, 255, 28); ellipse(x, y, pulse, pulse); } // 繪製低透明度漂浮微光
} // 完成前景微光繪製

function createConfetti() { // 建立多色旋轉飄落彩帶
  confetti = []; // 清空舊有彩帶
  const colors = ["#e63946", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff7f51"]; // 定義彩帶多色清單
  for (let i = 0; i < 110; i += 1) confetti.push({ x: Math.random() * width, y: -Math.random() * height, speed: 1.1 + Math.random() * 2.8, size: 5 + Math.random() * 8, phase: Math.random() * TWO_PI, color: colors[i % colors.length], spin: -0.05 + Math.random() * 0.1 }); // 建立隨機彩帶資料
} // 完成彩帶建立

function drawConfetti() { // 更新並繪製旋轉飄落彩帶
  noStroke(); // 移除彩帶外框
  for (const piece of confetti) { piece.y += piece.speed; piece.x += Math.sin(frameCount * 0.035 + piece.phase) * 0.75; fill(piece.color); push(); translate(piece.x, piece.y); rotate(frameCount * piece.spin + piece.phase); rect(0, 0, piece.size, piece.size * 0.48, 2); pop(); if (piece.y > height + 20) { piece.y = -20; piece.x = Math.random() * width; } } // 更新位置並繪製每片彩帶
} // 完成彩帶繪製

const MUSIC_NOTES = [261.63, 293.66, 329.63, 392.00, 349.23, 329.63, 293.66, 261.63]; // 定義柔和且速度適中的兒童主題音符循環
const MUSIC_NOTE_MS = 1180; // 設定每個背景音符之間的時間間隔
const MUSIC_FADE_MS = 850; // 設定背景音樂淡入淡出時間
const MUSIC_DEFAULT_VOLUME = 0.11; // 設定低於舒適上限的背景音樂音量
let musicState = { enabled: true, started: false, available: false, nextNoteAt: 0, noteIndex: 0, currentVolume: 0, targetVolume: 0, lead: null, harmony: null, leadEnvelope: null, harmonyEnvelope: null, soundLoopAvailable: false }; // 儲存背景音樂與靜音狀態

function draw() { updateBackgroundMusic(); drawGameFrame(); } // 更新音樂後繪製原有完整遊戲畫面

function hasSafeP5SoundSupport() { if (typeof p5 === "undefined") return false; const hasOscillator = typeof p5.Oscillator === "function"; const hasEnvelope = typeof p5.Envelope === "function"; musicState.soundLoopAvailable = typeof p5.SoundLoop === "function"; return hasOscillator && hasEnvelope; } // 安全檢查 p5.sound 的振盪器、包絡線與 SoundLoop 類別

function prepareAudioContextFromGesture() { if (typeof userStartAudio === "function") { try { const result = userStartAudio(); if (result && typeof result.catch === "function") result.catch(() => {}); } catch (error) {} } if (typeof getAudioContext === "function") { try { const context = getAudioContext(); if (context && typeof context.resume === "function") { const result = context.resume(); if (result && typeof result.catch === "function") result.catch(() => {}); } } catch (error) {} } } // 在使用者滑鼠或觸控手勢中安全喚醒 AudioContext

function createBackgroundMusic() { if (musicState.started) return musicState.available; if (!hasSafeP5SoundSupport()) return false; try { musicState.lead = new p5.Oscillator("sine"); musicState.harmony = new p5.Oscillator("triangle"); musicState.leadEnvelope = new p5.Envelope(); musicState.harmonyEnvelope = new p5.Envelope(); musicState.leadEnvelope.setADSR(0.08, 0.20, 0.18, 0.58); musicState.harmonyEnvelope.setADSR(0.12, 0.24, 0.12, 0.68); musicState.leadEnvelope.setRange(0.075, 0.001); musicState.harmonyEnvelope.setRange(0.032, 0.001); musicState.lead.amp(0); musicState.harmony.amp(0); musicState.lead.start(); musicState.harmony.start(); musicState.started = true; musicState.available = true; musicState.currentVolume = 0; musicState.targetVolume = musicState.enabled ? MUSIC_DEFAULT_VOLUME : 0; musicState.nextNoteAt = millis(); musicState.noteIndex = 0; return true; } catch (error) { musicState.available = false; musicState.started = false; musicState.lead = null; musicState.harmony = null; musicState.leadEnvelope = null; musicState.harmonyEnvelope = null; return false; } } // 建立不依賴外部音檔的柔和合成背景音樂

function startMusicFromUserGesture() { if (!musicState.enabled || !hasSafeP5SoundSupport()) return false; prepareAudioContextFromGesture(); return createBackgroundMusic(); } // 只在第一次使用者手勢後嘗試啟動背景音樂

function updateBackgroundMusic() { if (!musicState.started || !musicState.available) return; const now = millis(); const fadeStep = Math.max(0.001, (typeof deltaTime === "number" ? deltaTime : 16) / MUSIC_FADE_MS); musicState.currentVolume = lerp(musicState.currentVolume, musicState.targetVolume, constrain(fadeStep, 0, 1)); try { if (musicState.lead) musicState.lead.amp(musicState.currentVolume); if (musicState.harmony) musicState.harmony.amp(musicState.currentVolume * 0.42); if (musicState.enabled && now >= musicState.nextNoteAt) { playNextBackgroundNote(); musicState.nextNoteAt = now + MUSIC_NOTE_MS; } if (!musicState.enabled && musicState.currentVolume < 0.002) musicState.nextNoteAt = now + MUSIC_NOTE_MS; } catch (error) { musicState.available = false; } } // 每幀平滑更新音量並控制慢速音符循環

function playNextBackgroundNote() { if (!musicState.lead || !musicState.harmony || !musicState.leadEnvelope || !musicState.harmonyEnvelope) return; const note = MUSIC_NOTES[musicState.noteIndex % MUSIC_NOTES.length]; musicState.lead.freq(note); musicState.harmony.freq(note * 0.5); musicState.leadEnvelope.play(musicState.lead); musicState.harmonyEnvelope.play(musicState.harmony); musicState.noteIndex = (musicState.noteIndex + 1) % MUSIC_NOTES.length; } // 播放下一組柔和主旋律與低八度和聲

function toggleMusicSetting() { musicState.enabled = !musicState.enabled; if (musicState.enabled) { startMusicFromUserGesture(); musicState.targetVolume = MUSIC_DEFAULT_VOLUME; } else { musicState.targetVolume = 0; } } // 切換音樂開關並維持使用者的靜音選擇

function getLayoutMetrics() { const viewportW = windowWidth; const viewportH = windowHeight; const submittedExtra = quiz !== null && quiz.submitted ? 100 : 0; const scale = constrain(Math.min(viewportW / 960, viewportH / (690 + submittedExtra)), 0.32, 1.08); const margin = Math.max(8, Math.min(28, viewportW * 0.025)); const gap = Math.max(4, Math.min(13, 7 + scale * 3)); const cardColumns = viewportW >= 1120 ? 6 : 3; const cardRows = Math.ceil(6 / cardColumns); const headerH = Math.max(88, Math.min(122, 94 + scale * 18)); const cardW = (viewportW - margin * 2 - gap * (cardColumns - 1)) / cardColumns; const cardH = Math.max(66, Math.min(164, 112 + scale * 42)); const cardsBottom = headerH + cardRows * cardH + (cardRows - 1) * gap; const trayColumns = viewportW >= 760 ? 6 : 3; const trayRows = Math.ceil(6 / trayColumns); const trayH = Math.max(30, Math.min(50, 34 + scale * 12)); const trayY = cardsBottom + Math.max(16, 22 * scale); const trayW = (viewportW - margin * 2 - gap * (trayColumns - 1)) / trayColumns; const buttonCount = 4; const buttonColumns = viewportW >= 1060 ? 4 : viewportW >= 300 ? 2 : 1; const buttonRows = Math.ceil(buttonCount / buttonColumns); const buttonGap = Math.max(5, Math.min(13, 9 + scale * 3)); const buttonH = Math.max(30, Math.min(52, 35 + scale * 13)); const buttonY = trayY + trayRows * trayH + (trayRows - 1) * gap + Math.max(18, 24 * scale); const buttonW = buttonColumns === 1 ? Math.min(360, viewportW - margin * 2) : (viewportW - margin * 2 - buttonGap * (buttonColumns - 1)) / buttonColumns; const buttonsBottom = buttonY + buttonRows * buttonH + (buttonRows - 1) * buttonGap; const resultY = buttonsBottom + Math.max(9, 14 * scale); const resultH = quiz !== null && quiz.submitted ? Math.max(62, Math.min(116, 72 + scale * 28)) : 0; return { margin: margin, gap: gap, scale: scale, cardColumns: cardColumns, cardRows: cardRows, headerH: headerH, cardW: cardW, cardH: cardH, cardsBottom: cardsBottom, trayColumns: trayColumns, trayRows: trayRows, trayH: trayH, trayY: trayY, trayW: trayW, buttonCount: buttonCount, buttonColumns: buttonColumns, buttonRows: buttonRows, buttonGap: buttonGap, buttonH: buttonH, buttonY: buttonY, buttonW: buttonW, buttonsBottom: buttonsBottom, resultY: resultY, resultH: resultH }; } // 計算包含音樂按鈕且適合手機的響應式版面尺寸

function calculateLayout() { const metrics = getLayoutMetrics(); const cards = []; const tray = []; const buttons = []; for (let i = 0; i < 6; i += 1) { const col = i % metrics.cardColumns; const row = Math.floor(i / metrics.cardColumns); cards.push({ x: metrics.margin + col * (metrics.cardW + metrics.gap), y: metrics.headerH + row * (metrics.cardH + metrics.gap), w: metrics.cardW, h: metrics.cardH }); } for (let i = 0; i < 6; i += 1) { const col = i % metrics.trayColumns; const row = Math.floor(i / metrics.trayColumns); tray.push({ x: metrics.margin + col * (metrics.trayW + metrics.gap), y: metrics.trayY + row * (metrics.trayH + metrics.gap), w: metrics.trayW, h: metrics.trayH }); } for (let i = 0; i < metrics.buttonCount; i += 1) { const col = i % metrics.buttonColumns; const row = Math.floor(i / metrics.buttonColumns); const x = metrics.buttonColumns === 1 ? (width - metrics.buttonW) / 2 : metrics.margin + col * (metrics.buttonW + metrics.buttonGap); const y = metrics.buttonY + row * (metrics.buttonH + metrics.buttonGap); buttons.push({ x: x, y: y, w: metrics.buttonW, h: metrics.buttonH }); } const fullscreenW = Math.max(96, Math.min(158, width * 0.19)); const fullscreenH = Math.max(32, Math.min(44, 34 + metrics.scale * 9)); const fullscreenButton = { x: width - metrics.margin - fullscreenW, y: 10, w: fullscreenW, h: fullscreenH }; return { metrics: metrics, cards: cards, tray: tray, buttons: buttons, fullscreenButton: fullscreenButton, resultY: metrics.resultY }; } // 建立六張卡片、六個名稱標籤與四個不重疊功能按鈕

function drawButtons() { if (!layoutData || !quiz) return; drawButton(layoutData.buttons[0], "點我看答案", quiz.showAnswer || quiz.submitted, "answer"); drawButton(layoutData.buttons[1], quiz.submitted ? "已交卷看成績" : "交卷看成績", quiz.submitted, "submit"); drawButton(layoutData.buttons[2], "重新出題", false, "reset"); drawButton(layoutData.buttons[3], musicState.enabled ? "音樂：開" : "音樂：關", false, "music"); } // 繪製原有三個按鈕並加入清楚可見的音樂開關

function drawButton(box, label, disabled, kind) { if (!box) return; const isHover = hoveredButton === kind && !disabled; const isPressed = pressedButton === kind; const buttonColor = kind === "reset" ? "#5c677d" : kind === "submit" ? UI.blue : kind === "music" ? "#267a78" : "#386641"; const lift = isHover ? -2 : 0; const pressScale = isPressed ? 0.965 : isHover ? 1.018 : 1; const drawW = box.w * pressScale; const drawH = box.h * pressScale; push(); translate(box.x + box.w / 2, box.y + box.h / 2 + lift); drawingContext.shadowColor = disabled ? "rgba(24,50,74,0.10)" : isHover ? "rgba(16,42,67,0.34)" : "rgba(16,42,67,0.21)"; drawingContext.shadowBlur = isHover ? 15 : 8; drawingContext.shadowOffsetY = isPressed ? 2 : 5; noStroke(); fill(disabled ? "rgba(24,50,74,0.44)" : buttonColor); rect(-drawW / 2, -drawH / 2, drawW, drawH, 13); drawingContext.shadowBlur = 0; drawingContext.shadowOffsetY = 0; stroke(255, 255, 255, isHover ? 190 : 95); strokeWeight(isHover ? 1.8 : 1); noFill(); rect(-drawW / 2, -drawH / 2, drawW, drawH, 13); noStroke(); fill(UI.white); textSize(Math.max(11, Math.min(18, box.w * 0.075))); text(label, 0, 0); pop(); } // 繪製具有懸停、按下與玻璃擬態效果的單一功能按鈕

function hitButton(x, y) { if (!layoutData) return ""; if (inside(x, y, layoutData.fullscreenButton)) return "fullscreen"; const kinds = ["answer", "submit", "reset", "music"]; for (let i = 0; i < layoutData.buttons.length; i += 1) if (inside(x, y, layoutData.buttons[i])) return kinds[i]; return ""; } // 使用既有 Canvas hit testing 判斷全螢幕與四個按鈕

function getHoveredButton(x, y) { return hitButton(x, y); } // 共用同一套 Canvas 命中測試更新按鈕懸停狀態

function mousePressed() { if (!quiz || !layoutData) return false; pressedButton = hitButton(mouseX, mouseY); if (pressedButton === "music") { toggleMusicSetting(); pressedButton = ""; return false; } startMusicFromUserGesture(); if (pressedButton === "fullscreen") { toggleBrowserFullscreen(); pressedButton = ""; return false; } if (pressedButton === "reset") { resetQuiz(); pressedButton = ""; return false; } if (pressedButton === "answer" && !quiz.showAnswer && !quiz.submitted) { quiz.showAnswer = true; dragging = null; createFeedbackBursts(); pressedButton = ""; return false; } if (pressedButton === "submit" && !quiz.submitted) { submitQuiz(); pressedButton = ""; return false; } if (quiz.showAnswer || quiz.submitted) { pressedButton = ""; return false; } const slotIndex = hitSlot(mouseX, mouseY); if (slotIndex >= 0 && quiz.slots[slotIndex] !== null) { startDrag(quiz.slots[slotIndex], "slot", slotIndex); return false; } const labelIndex = hitTrayLabel(mouseX, mouseY); if (labelIndex >= 0) startDrag(labelIndex, "tray", -1); return false; } // 處理滑鼠與觸控按下、音樂啟動、靜音切換及原有拖曳功能
