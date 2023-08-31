/**
 * 參數傳遞用
 */

angular.module('boundle', [])
.service('boundle', function() {
	/** Map 大小**/
	var size = 0;
	/** 對象**/
	var entry = new Object();

	/** 存**/
	this.setData = function  (key , value)
	{
		if (! this .containsKey(key))
		{
			size ++ ;
		}
		entry[key] = value;
	}

	/** 取**/
	this.getData = function  (key)
	{
		if ( this .containsKey(key) )
		{
			return  entry[key];
		}
		else
		{
			return  null ;
		}
	}

	/** 刪除**/
	this.remove = function  ( key )
	{
		if ( delete  entry[key] )
		{
			size --;
		}
	}

	/** 是否包含Key **/
	this.containsKey = function  ( key )
	{
		return  (key in  entry);
	}

	/** 是否包含Value **/
	this.containsValue = function  ( value )
	{
		for ( var  prop in  entry)
		{
			if (entry[prop] == value)
			{
				return  true ;
			}
		}
		return  false ;
	}

	/** 所有Value **/
	//this.values ​​= function  ()
	//{
	//	var  values ​​= new  Array(size);
	//	for ( var  prop in  entry)
	//	{
	//		values​​.push(entry[prop]);
	//	}
	//	return  values;
	//}

	/** 所有Key **/
	this.keys = function  ()
	{
		var  keys = new  Array(size);
		for ( var  prop in  entry)
		{
			keys.push(prop);
		}
		return  keys;
	}

	/** Map Size **/
	this.size = function  ()
	{
		return  size;
	}
});