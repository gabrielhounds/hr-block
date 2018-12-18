

/*
		
		
			if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex][columnIndex+1] !== 'filled' ) {
				rowIndex++;
				
				columnIndex = nextColumnIndex;
				
				sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
				sq[rowIndex][columnIndex+1].removeChild(blocks[blockIndex+1]);

				sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
				sq[rowIndex-1][columnIndex+1].addChild(blocks[blockIndex+1]);	
							
			} else {
				
				grid[rowIndex][columnIndex] = 'filled';	
				grid[rowIndex-1][columnIndex+1] = 'filled';
							
				if (rowIndex === 1) {
					log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
					ticker.stop();
				}
				if ( grid[rowIndex].every(isFilled) ) {
					ticker.stop();
					handleRowDrop();					
				}
				rowIndex = 0;
				blockIndex+=2;
			}
			dRate = 0;			
		}

		
		if (dRate >= 30) {
			if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' && grid[rowIndex + 1][columnIndex+2] !== 'filled' ) {
				rowIndex++;
				
				columnIndex = nextColumnIndex;
				
				sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
				sq[rowIndex-1][columnIndex+1].removeChild(blocks[blockIndex+1]);
				sq[rowIndex-1][columnIndex+2].removeChild(blocks[blockIndex+2]);


				sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
				sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex+1]);
				sq[rowIndex][columnIndex+2].addChild(blocks[blockIndex+2]);	

							
			} else {
				grid[rowIndex][columnIndex] = 'filled';	
				grid[rowIndex][columnIndex+1] = 'filled';
				grid[rowIndex][columnIndex+2] = 'filled';

							
				if (rowIndex === 1) {
					log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
					ticker.stop();
				}
				if ( grid[rowIndex].every(isFilled) ) {
					ticker.stop();
					handleRowDrop();					
				}
				rowIndex = 0;
				blockIndex+=3;
			}
			dRate = 0;			
		}
		
		
		if (dRate >= 30) {
			if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled' ) {
				rowIndex++;
				
				columnIndex = nextColumnIndex;
				
				sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
				sq[rowIndex-1][columnIndex+1].removeChild(blocks[blockIndex+1]);

				sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
				sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex+1]);	
							
			} else {
				grid[rowIndex][columnIndex] = 'filled';	
				grid[rowIndex][columnIndex+1] = 'filled';
							
				if (rowIndex === 1) {
					log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
					ticker.stop();
				}
				if ( grid[rowIndex].every(isFilled) ) {
					ticker.stop();
					handleRowDrop();					
				}
				rowIndex = 0;
				blockIndex+=2;
			}
			dRate = 0;			
		}

		
		if (dRate >= 30) {
			if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled' && grid[rowIndex + 1][columnIndex+1] !== 'filled') {
				rowIndex++;
				columnIndex = nextColumnIndex;
				
				sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
				sq[rowIndex-1][columnIndex+1].removeChild(blocks[blockIndex+1]);

				sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);
				sq[rowIndex][columnIndex+1].addChild(blocks[blockIndex+1]);	
							
			} else {
				grid[rowIndex][columnIndex] = 'filled';	
				grid[rowIndex][columnIndex+1] = 'filled';
							
				if (rowIndex === 1) {
					log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
					ticker.stop();
				}
				if ( grid[rowIndex].every(isFilled) ) {
					ticker.stop();
					handleRowDrop();					
				}
				rowIndex = 0;
				blockIndex+=2;
			}
			dRate = 0;			
		}
		*/
		
		if (dRate >= 30) {
			if (rowIndex < grid.length-1 && grid[rowIndex + 1][columnIndex] !== 'filled') {
				rowIndex++;
				columnIndex = nextColumnIndex;
				sq[rowIndex-1][columnIndex].removeChild(blocks[blockIndex]);
				sq[rowIndex][columnIndex].addChild(blocks[blockIndex]);				
			} else {
				grid[rowIndex][columnIndex] = 'filled';			
				if (rowIndex === 1) {
					log('+++++++++ AT THE TOP - GAME OVER ++++++++++++ ');
					ticker.stop();
				}
				if ( grid[rowIndex].every(isFilled) ) {
					ticker.stop();
					handleRowDrop();					
				}
				rowIndex = 0;
				blockIndex++;
			}
			dRate = 0;			
		}
