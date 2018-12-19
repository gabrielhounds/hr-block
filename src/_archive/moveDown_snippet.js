	
	
	
	for (var i = 0; i < 4; i++) {
		sq[rowIndex][i].removeChild(sq[rowIndex][i].children[0]);
		grid[rowIndex][i] = 'empty';
	}
	
	log(grid);
	
	for ( var r = 0; r < rowNum; r++ ) {
		for ( var c = 0; c < 4; c++ ) {
		// TODO: MOVE BLOCKS DOWN
		
			//if (grid[r][c] === 'filled')
		
			if( sq[r][c].children.length !== 0 ) {
				log(sq[r][c].children[0]);
				activeChild = sq[r][c].children[0];
				newRow = r+=1;
				sq[newRow][c].addChild( activeChild );
			}
			
			if (grid[r][c] = 'filled'){
				
				//log(grid[r][c]);
				
			}
			
			//grid[r][c] = 'empty';
			//grid[newRow][c] = 'filled';
		

		
		
		}
	}