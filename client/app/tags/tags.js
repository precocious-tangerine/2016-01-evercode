class Tags {
  constructor() {
    this.template = '<span>TAGS: </span><span style="margin-left: 10px" ng-repeat="tag in tags">{{ tag }}</span>';
    this.scope: { tags: '=data' };
  }
}
