define( function () {
	
	var Event = function(creatorID, obj ){
		this.creatorID = creatorID;
		this.tripType = obj.passenger() ? 'AutoStop' : 'Expedition';
		this.seatNumber = obj.passenger() ? obj.passenger() : 0;
		this.availableSeats = obj.passenger() ? obj.passenger() : 0;
		this.fromName = obj.from.Name();
		this.toName = obj.to.Name();
		this.date = obj.date().toISOString().slice(0, 19).replace('T', ' ');
		this.eventDescription = obj.eventDescription();
		this.eventName = obj.eventName();
		this.carType = obj.carType();
		this.fromX = obj.from.latlng().lng();
		this.fromY = obj.from.latlng().lat();
		this.toX = obj.to.latlng().lng();
		this.toY = obj.to.latlng().lat();
		var searchData = calcSearchData(this.fromX,this.fromY,this.toX,this.toY);
		this.direction = searchData.direction;
		this.x = searchData.x;
		this.y = searchData.y;
		this.height = searchData.height;
		this.width = searchData.width;
		function calcSearchData(fromX,fromY,toX,toY){
			if( toX >= fromX && toY >= fromY )
				return {direction:1,x:fromX,y:fromY,height:toY-fromY,width:toX-fromX};
			else if( toX < fromX && toY > fromY )
				return {direction:2,x:toX,y:fromY,height:toY-fromY,width:fromX-toX}
			else if( toX <= fromX && toY <= fromY ) 
				return {direction:3,x:toX,y:toY,height:fromY-toY,width:fromX-toX}
			else return {direction:4,x:fromX,y:toY,height:fromY-toY,width:toX-fromX}
		}
	}
	Event.prototype.countIntersectArea = function(that){
		var newX = Math.max(this.x,that.x);
		var newY = Math.max(this.y,that.y);
		var newWidth = Math.min( this.x + this.width, that.x + that.width ) - newX;
		var newHeight = Math.min( this.y + this.height, that.y + that.height ) - newY;
		if( newWidth <= 0 || newHeight <= 0 )
			return null;
		else return newWidth * newHeight; 
	}
	return Event;
});


