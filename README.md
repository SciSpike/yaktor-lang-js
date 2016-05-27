## `yaktor-lang`
By including the necessary jars and logic for generating source for the `.cl` and `.dm` languages,
this project aims to streamline the process of deploying source generation to any java enabled environment.

### To deploy a new version of generator
*In eclipse:*
1. If you don't already have a run profile for the conversation project.
    1. Right click on the `com.scispike.conversation.cs` project
    2. Select `Run as >`, then  `Java Application`, then make sure `Main - com.scispike.generator` is selected.
2. Right click on the `com.scispike.conversion.cs` project
    1. Select `Export…`
    2. Select `Runnable JAR file` then click `Next >`
        1. Under `Launch configuration:`, select `Main - com.scispike.generator`
        2. Under `Export destination:`, select the location of *this project's* root folder.
        3. Under `Library handling:`, select `Copy required libraries into a sub-folder next to the generated jar`
        4. Click `Finish`
3. Publish/push changes
4. `npm run minor`
5. `npm run patch`
6. Note the new version created and update the consuming package.json(s).
