import { builder } from '../util'
export const mockReport = (options) => {
	const mockReport = {
		'total': 2,
		'list': [
			{
				'id': '1',
				'createBy': 'admin',
				'report': '测试报告1',
				'projectId': '1',
				'createTime': '2021-01-30 13:27:43',
				'endTime': '2021-09-05 10:11:01',
                'touchWay': '手动触发',
				'remark': '1',
				'delFlag': '0',
				'status': '0'
			},
			{
				'id': '2',
				'createBy': 'admin',
				'report': '测试报告2',
				'projectId': '1',
				'createTime': '2021-01-30 13:27:43',
				'endTime': '2021-09-05 10:11:01',
                'touchWay': '手动触发',
				'remark': '1',
				'delFlag': '0',
				'status': '1'
			},
            {
				'id': '3',
				'createBy': 'admin',
				'report': '测试报告3',
				'projectId': '1',
				'createTime': '2021-01-30 13:27:43',
				'endTime': '2021-09-05 10:11:01',
                'touchWay': '手动触发',
				'remark': '1',
				'delFlag': '0',
				'status': '2'
			}
		],
		'pageNum': 1,
		'pageSize': 10,
		'size': 3,
		'startRow': 1,
		'endRow': 2,
		'pages': 1,
		'prePage': 0,
		'nextPage': 0,
		'isFirstPage': true,
		'isLastPage': true,
		'hasPreviousPage': false,
		'hasNextPage': false,
		'navigatePages': 8,
		'navigatepageNums': [
			1
		],
		'navigateFirstPage': 1,
		'navigateLastPage': 1
	}
	return builder(mockReport)
}
