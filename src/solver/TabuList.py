class TabuList:
    def __init__(self, maxMoves):
        self.maxMoves = maxMoves
        self.tabuList = []
    
    def move(self, newMove):
        self.tabuList.append(newMove)

        if len(self.tabuList) > self.maxMoves:
            # remove the oldest move
            self.tabuList.pop(0)
    
    def checkMove(self, move):
        return move in self.tabuList
