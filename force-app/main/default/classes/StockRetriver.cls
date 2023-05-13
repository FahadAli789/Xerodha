public  class StockRetriver {
    // public static QuerySelector selectedQueries = new QuerySelector();
    // @AuraEnabled
    // public static List<Holding__c> retriveStockHoldings(){
    //     try {
            
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }
    // public List<Holding__c> reverseDataToParentChild(List<Stock_Order__c> stockOrders){
    //     Map<Id,Holding__c> holdingMap = new Map<Id,Holding__c>();
    //     for(Stock_Order__c stockOrder:stockOrders){
    //         if(holdingMap.containsKey(Stock__r.Holding__c)){
    //             holdingMap.get(Stock__r.Holding__c);
    //         }
    //         else{
    //             Holding__c holding= new Holding__c
    //         }
    //     }

    // }
    // public class QuerySelector{
    //     public List<Stock_Order__c> stockOrderRetrive(Id holdingId){
    //         return [SELECT Id,Name,Stock__c,Stock__r.Name,Stock__r.Holding__r.Name,Stock__r.Holding__c FROM Stock_Order__c WHERE Stock__r.Holding__c=:holdingId ];
    //     }
    // }
}