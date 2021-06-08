export const checkUserCard = {
	data() {
		return {}
	},
	methods: {
		checkUserCard(object) {
			console.log(object)
			if(object.userInfo.userCard && object.userInfo.userCard.bindStatus == 1 && object.userInfo.userCard.cardStatus == 0){
				object && object.success && object.success(object.userInfo)
			}else{
				object && object.fail && object.fail(object.userInfo)
			}
		}
	}
}