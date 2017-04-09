import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  board: Array<Number> = new Array(16).fill(0);

  color: {} = {
    0: '#cec6bd',
    2: '#eee4da',
    4: '#eee4da',
    8: '#f26179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e36',
    128: '#edcf72',
    256: '#edcc61',
    512: '#9c0',
    1024: '#3365a5',
    2048: '#09c',
    4096: '#a6bc',
    8192: '#93c'
  }

  @HostListener('document:keydown', ['$event']) onkeydown(e) {
    let keyCode = e.keyCode;
    switch(keyCode) {
      // 左
      case 37:
        this.pullLeft();
        break;
      // 上
      case 38:
        this.pullUp();
        break;
      // 右
      case 39:
        this.pullRight();
        break;
      // 下
      case 40:
        this.pullDown();
        break;
    }
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.createNewNumber();
    this.createNewNumber();
  }

  // 创建新 2 数字
  createNewNumber() {
    // 获取空Box index
    let emptyBoxIndex = [];
    this.board.forEach((item, index) => {
      if (!item) {
        emptyBoxIndex.push(index);
      }
    });
    // 随机一个位置
    let randomNum = Math.ceil(Math.random() * emptyBoxIndex.length - 1);
    // 获取表盘index
    let boardIndex = emptyBoxIndex[randomNum];
    this.board[boardIndex] = 2;
  }

  // 获取排
  getRow() {
    let rows = [];
    for(let i = 0, j = 1; i < this.board.length; i += 4, j++) {
      rows.push(this.board.slice(i, i + 4));
    }
    return rows;
  }

  // 恢复排
  restoreRow(rowsFormated) {
    let board = [];
    rowsFormated.forEach(row => {
      board = board.concat(row);
    });
    this.board = board;
  }

  // 获取列
  getColumn() {
    let column = {};
    let columnIndex = 1;
    let categoryBox = (num) => {
      if (!column[`column${columnIndex}`]){
        column[`column${columnIndex}`] = [];
      }
      column[`column${columnIndex}`].push(num);
      columnIndex++;
      if (columnIndex === 5) {
        columnIndex = 1;
      }
    }
    for(let i = 0; i < this.board.length; i++) {
      categoryBox(this.board[i]);
    }
    let columnArr = [];
    Object.keys(column).forEach(attr => {
      columnArr.push(column[attr]);
    });
    return columnArr;
  }

  // 恢复列
  restoreColumn(columnsFormated) {
    let board = new Array(16).fill(0);
    columnsFormated.forEach((column, columnIndex) => {
      column.forEach((box, index) => {
        board[columnIndex + index * 4] = box;
      });
    });
    this.board = board;
  }

  // 计算box
  // arrs 横向arrs 或者竖向arrs
  // order方向 (left, up -> true)(right, down -> false)
  calcBox(arrs, order = true) {
    let arrsFormated = [];
    arrs.forEach(arr => {
      let arrFill = arr.filter(box => box);
      // 判断相同数字计算
      for (let i = 0; i < arrFill.length; i++) {
        let num = arrFill[i];
        if (num === arrFill[i + 1]) {
          if (order) {
            arrFill[i] = num * 2;
            arrFill[i + 1] = 0;
          } else {
            arrFill[i + 1] = num * 2;
            arrFill[i] = 0;
          }
          // 跳过下个index循环
          i++;
        }
      }
      arrFill = arrFill.filter(box => box);
      arrsFormated.push(arrFill);
    });
    // 补全空值
    arrsFormated.forEach(row => {
      let length = row.length;
      if (length !== 4) {
        if (order) {
          row.length = 4;
          row.fill(0, length);
        } else {
          for (let i = length; i < 4; i++) {
            row.unshift(0);
          }
        }
      }
    });
    return arrsFormated;
  }

  pullLeft() {
    let rows = this.getRow();
    let rowsFormated = this.calcBox(rows, true);
    this.restoreRow(rowsFormated);
    this.createNewNumber();
  }

  pullRight() {
    let rows = this.getRow();
    let rowsFormated = this.calcBox(rows, false);
    this.restoreRow(rowsFormated);
    this.createNewNumber();
  }

  pullUp() {
    let columns = this.getColumn();
    let columnsFormated = this.calcBox(columns, true);
    this.restoreColumn(columnsFormated);
    this.createNewNumber();
  }

  pullDown() {
    let columns = this.getColumn();
    let columnsFormated = this.calcBox(columns, false);
    this.restoreColumn(columnsFormated);
    this.createNewNumber();
  }

}
