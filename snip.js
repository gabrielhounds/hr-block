for( y = r; y > 1; y--){
								if( grid[y][c] === 'filled' ){
									grid[y][c] = grid[y-1][c];
								}

								if( sq[y][c].children.length !== 0 ) {
									//sq[y][c] = sq[y-1][c];

									var activeChild = sq[y][c].children[0];
									var newRow = y+=1;

									sq[y][c].removeChild( activeChild );
									sq[newRow][c].addChild( activeChild );
								}



							}


								/*if( sq[r][c].children.length !== 0 ) {

								//log(sq[r][c].children[0]);

								//activeChild = sq[r][c].children[0];
								//newCRow = r+=1;

								//sq[r][c].removeChild( activeChild );
								//sq[newCRow][c].addChild( activeChild );
							}*/