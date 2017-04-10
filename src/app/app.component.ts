import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  board: Array<Number>;

  score: number;

  color: {} = {
    0: {
      bg: '#cec6bd'
    },
    2: {
      bg: '#eee4da'
    },
    4: {
      bg: '#eee4da'
    },
    8: {
      bg: '#f26179'
    },
    16: {
      bg: '#f59563'
    },
    32: {
      bg: '#f67c5f'
    },
    64: {
      bg: '#f65e36'
    },
    128: {
      bg: '#edcf72'
    },
    256: {
      bg: '#edcc61'
    },
    512: {
      bg: '#9c0'
    },
    1024: {
      bg: '#3365a5'
    },
    2048: {
      bg: '#09c'
    },
    4096: {
      bg: '#a6bc'
    },
    8192: {
      bg: '#93c'
    }
  }

  progress: boolean = false;

  @ViewChild('gameBoard') gameBoard: ElementRef;

  @HostListener('document:keydown', ['$event']) onkeydown(e) {
    let keyCode = e.keyCode;
    switch(keyCode) {
      // 左
      case 37:
        this.pullRow(true);
        break;
      // 上
      case 38:
        this.pullColumn(true);
        break;
      // 右
      case 39:
        this.pullRow(false);
        break;
      // 下
      case 40:
        this.pullColumn(false);
        break;
    }
  }

  ngOnInit() {
    this.initMobileEvent();
    this.progress = true;
    this.init()
      .then(() => this.progress = false);
  }

  init() {
    this.score = 0;
    this.board = new Array(16).fill(0);
    return Promise.all([
      this.createNewNumber(),
      this.createNewNumber()
    ]);
  }

  initMobileEvent() {
    let hammertime = new Hammer(this.gameBoard.nativeElement);
    hammertime.get('swipe').set({
      direction: Hammer.DIRECTION_ALL
    });
    hammertime.on('swipeleft', () => this.pullRow(true));
    hammertime.on('swiperight', () => this.pullRow(false));
    hammertime.on('swipeup', () => this.pullColumn(true));
    hammertime.on('swipedown', (e) => {
      e.preventDefault();
      this.pullColumn(false);
    });
  }

  // 创建新 2 数字
  createNewNumber(): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
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
      resolve(this.board);
    });
  }

  // 获取排
  getRow(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      let rows = [];
      for(let i = 0, j = 1; i < this.board.length; i += 4, j++) {
        rows.push(this.board.slice(i, i + 4));
      }
      resolve(rows);
    });
  }

  // 恢复排
  restoreRow(rowsFormated): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      let board = [];
      rowsFormated.forEach(row => {
        board = board.concat(row);
      });
      this.board = board;
      resolve(this.board);
    });
  }

  // 获取列
  getColumn(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
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
      resolve(columnArr);
    });
  }

  // 恢复列
  restoreColumn(columnsFormated): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      let board = new Array(16).fill(0);
      columnsFormated.forEach((column, columnIndex) => {
        column.forEach((box, index) => {
          board[columnIndex + index * 4] = box;
        });
      });
      this.board = board;
      resolve(this.board);
    });
  }

  // 计算box
  // arrs 横向arrs 或者竖向arrs
  // order方向 (left, up -> true)(right, down -> false)
  calcBox(arrs, order = true): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
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
            // 计算分数
            this.score += num * 2;
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
      resolve(arrsFormated);
    });
  }

  checkCanPull(origin, formated): Promise<boolean> {
    return Promise.resolve(origin.toString() !== formated.toString());
  }

  checkGameOver(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let emptyBorad = this.board.filter(box => !box);
      if (emptyBorad.length) return resolve(false);
      let rows, columns;
      Promise.all([
        this.getRow(),
        this.getColumn()
      ])
        .then(resArr => {
          rows = resArr[0];
          columns = resArr[1];
          return Promise.all([
            this.calcBox(rows, true),
            this.calcBox(rows, false),
            this.calcBox(columns, true),
            this.calcBox(columns, false)
          ]);
        })
        .then(resArr => {
          return Promise.all([
            this.checkCanPull(rows, resArr[0]),
            this.checkCanPull(rows, resArr[1]),
            this.checkCanPull(columns, resArr[2]),
            this.checkCanPull(columns, resArr[3])
          ]);
        })
        .then(booleanArr => {
          resolve(booleanArr.indexOf(true) !== -1 ? false : true);
        });
    });
  }

  handleGameOver(isGrmeOver): Promise<any> {
    if (isGrmeOver) {
      setTimeout(() => {
        alert('游戏结束');
        return this.init();
      });
    } else {
      return Promise.resolve(this.board);
    }
  }

  pullRow(isPullleft = true) {
    if (!this.progress) {
      this.progress = true;
      let rows, rowsFormated;
      this.getRow()
        .then(rowsRes => {
          rows = rowsRes;
          return this.calcBox(rows, isPullleft);
        })
        .then(rowsFormatedRes => {
          rowsFormated = rowsFormatedRes;
          return this.checkCanPull(rows, rowsFormated);
        })
        .then(canPull => {
          if (canPull) {
            return this.restoreRow(rowsFormated).then(this.createNewNumber.bind(this));
          }
        })
        .then(this.checkGameOver.bind(this))
        .then(this.handleGameOver.bind(this))
        .then(() => this.progress = false);
    }
  }

  pullColumn(isPullUp = true) {
    if (!this.progress) {
      this.progress = true;
      let columns, columnsFormated;
      this.getColumn()
        .then(columnsRes => {
          columns = columnsRes;
          return this.calcBox(columns, isPullUp);
        })
        .then(columnsFormatedRes => {
          columnsFormated = columnsFormatedRes;
          return this.checkCanPull(columns, columnsFormated);
        })
        .then(canPull => {
          if (canPull) {
            return this.restoreColumn(columnsFormated).then(this.createNewNumber.bind(this));
          }
        })
        .then(this.checkGameOver.bind(this))
        .then(this.handleGameOver.bind(this))
        .then(() => this.progress = false);
    }
  }

}
