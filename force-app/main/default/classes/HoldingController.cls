public  class HoldingController {
    @AuraEnabled(cacheable=true)
    public static List<Stock_Order__c> retriveStockOrders(List<Id> holdingIds) {
        return [SELECT Id,Name,Date_of_Transaction__c,Buy_Price__c,Qty__c,Stock__c,Stock__r.Name,Stock__r.Sell_Price__c,Stock__r.Holding__r.Name,Stock__r.Holding__c FROM Stock_Order__c WHERE Stock__r.Holding__c=:holdingIds ];
    }
}