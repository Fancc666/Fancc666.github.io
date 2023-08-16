var Matrix = Matrix || {};
Matrix.det = (square)=>{
    // 方阵约束
    if(square.length !== square[0].length) {
       throw new Error();
    }

    // 方阵阶数
    const n = square.length;

    let result = 0;

    if(n > 3) {
       // n 阶
       for(let column = 0; column < n; column++) {
       // 去掉第 0 行第 column 列的矩阵
          const matrix = new Array(n - 1).fill(0).map(arr => new Array(n - 1).fill(0));

          for(let i = 0; i < n - 1; i++) {
             for(let j = 0; j < n - 1; j++) {
                if(j < column) {
                   matrix[i][j] = square[i + 1][j];
                }
                else {
                   matrix[i][j] = square[i + 1][j + 1];
                }
             }
          }

          result += square[0][column] * Math.pow(-1, 0 + column) * Matrix.det(matrix);
       }
    }
    else if(n === 3) {
       // 3 阶
       result = square[0][0] * square[1][1] * square[2][2] +
            square[0][1] * square[1][2] * square[2][0] +
            square[0][2] * square[1][0] * square[2][1] -
            square[0][2] * square[1][1] * square[2][0] -
            square[0][1] * square[1][0] * square[2][2] -
            square[0][0] * square[1][2] * square[2][1];
    }
    else if(n === 2) {
       // 2 阶
       result = square[0][0] * square[1][1] - square[0][1] * square[1][0];
    }
    else if(n === 1) {
       // 1 阶
       result = square[0][0];
    }

    return result;
}

Matrix.transpose = (matrix)=>{
    const result = new Array(matrix.length).fill(0).map(arr => new Array(matrix[0].length).fill(0));

    for(let i = 0; i < result.length; i++) {
        for(let j = 0; j < result[0].length; j++) {
            result[i][j] = matrix[j][i];
        }
    }

    return result;
 }

 Matrix.adjoint = (square)=>{
    // 方阵约束
    if(square[0].length !== square.length) {
       throw new Error();
    }

    const n = square.length;

    const result = new Array(n).fill(0).map(arr => new Array(n).fill(0));

    for(let row = 0; row < n; row++) {
       for(let column = 0; column < n; column++) {
       // 去掉第 row 行第 column 列的矩阵
          const matrix = [];

          for(let i = 0; i < square.length; i++) {
             if(i !== row) {
                const arr = [];

                for(let j = 0; j < square.length; j++) {
                   if(j !== column) {
                      arr.push(square[i][j]);
                   }
                }

                matrix.push(arr);
             }
          }

          result[row][column] = Math.pow(-1, row + column) * Matrix.det(matrix);
       }
    }

    return Matrix.transpose(result);
}

Matrix.inv = (square)=>{
    if(square[0].length !== square.length) {
       throw new Error();
    }

    const detValue = Matrix.det(square);
    const result = Matrix.adjoint(square);

    for(let i = 0; i < result.length; i++) {
       for(let j = 0; j < result.length; j++) {
          result[i][j] /= detValue;
       }
    }

    return result;
}

Matrix.multiply = (a, b)=>{
   // 相乘约束
   if (a[0].length !== b.length) {
      console.log(a[0].length, b.length);
      throw new Error();
   }
   let m = a.length;
   let p = a[0].length;
   let n = b[0].length;

   // 初始化 m*n 全 0 二维数组
   let c = new Array(m).fill(0).map(arr => new Array(n).fill(0));

   for (let i = 0; i < m; i++) {
       for (let j = 0; j < n; j++) {
           for (let k = 0; k < p; k++) {
               c[i][j] += a[i][k] * b[k][j];
           }
       }
   }

   return c;
}

export {Matrix};