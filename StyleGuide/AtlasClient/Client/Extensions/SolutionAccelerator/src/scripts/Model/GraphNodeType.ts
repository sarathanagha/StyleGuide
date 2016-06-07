module Microsoft.DataStudio.SolutionAccelerator.Model.Graph {

    export enum GraphNodeType {
        DataFactory,
        Sql,
        HDInsight,
        StreamAnalytics,
        ClassicStorage,
        EventHub,
        MachineLearning,
        SampleData,
        PowerBI,
        InputData,
        Storage // to support both resource types Microsoft.ClassicStorage and Microsoft.Storage 
    }
}
