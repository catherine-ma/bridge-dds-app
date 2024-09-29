/*
   DDS, a bridge double dummy solver.

   Copyright (C) 2006-2014 by Bo Haglund /
   2014-2018 by Bo Haglund & Soren Hein.

   See LICENSE and README.
*/

/*
   This is the parent class of TransTableS and TransTableL.
   Those two are different implementations.  The S version has a
   much smaller memory and a somewhat slower execution time.
*/

#ifndef DDS_TRANSTABLE_H
#define DDS_TRANSTABLE_H

#include <iostream>
#include <fstream>
#include <string>

#include "dds.h"

using namespace std;


enum TTresetReason
{
  TT_RESET_UNKNOWN = 0,
  TT_RESET_TOO_MANY_NODES = 1,
  TT_RESET_NEW_DEAL = 2,
  TT_RESET_NEW_TRUMP = 3,
  TT_RESET_MEMORY_EXHAUSTED = 4,
  TT_RESET_FREE_MEMORY = 5,
  TT_RESET_SIZE = 6
};

struct nodeCardsType // 8 bytes
{
  char ubound; // For N-S
  char lbound; // For N-S
  char bestMoveSuit;
  char bestMoveRank;
  char leastWin[DDS_SUITS];
};

class TransTable
{
  public:
    virtual ~TransTable() {};

    virtual void Init(const int handLookup[][15]) = 0;

    virtual void SetMemoryDefault(const int megabytes) = 0;

    virtual void SetMemoryMaximum(const int megabytes) = 0;

    virtual void MakeTT() = 0;

    virtual void ResetMemory(const TTresetReason reason) = 0;

    virtual void ReturnAllMemory() = 0;

    virtual double MemoryInUse() const = 0;

    virtual nodeCardsType const * Lookup(
      const int trick,
      const int hand,
      const unsigned short aggrTarget[],
      const int handDist[],
      const int limit,
      bool& lowerFlag) = 0;

    virtual void Add(
      const int trick,
      const int hand,
      const unsigned short aggrTarget[],
      const unsigned short winRanksArg[],
      const nodeCardsType& first,
      const bool flag) = 0;

    virtual void PrintSuits(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/) const {};

    virtual void PrintAllSuits(ofstream& /*fout*/) const {};

    virtual void PrintSuitStats(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/) const {};

    virtual void PrintAllSuitStats(ofstream& /*fout*/) const {};

    virtual void PrintSummarySuitStats(ofstream& /*fout*/) const {};

    virtual void PrintEntriesDist(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/,
      const int[] /*handDist[]*/) const {};

    virtual void PrintEntriesDistAndCards(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/,
      const unsigned short[] /*aggrTarget[]*/,
      const int[] /*handDist[]*/) const {};

    virtual void PrintEntries(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/) const {};

    virtual void PrintAllEntries(ofstream& /*fout*/) const {};

    virtual void PrintEntryStats(
      ofstream& /*fout*/,
      const int /*trick*/,
      const int /*hand*/) const {};

    virtual void PrintAllEntryStats(ofstream& /*fout*/) const {};

    virtual void PrintSummaryEntryStats(ofstream& /*fout*/) const {};

    virtual void PrintPageSummary(ofstream& /*fout*/) const {};

    virtual void PrintNodeStats(ofstream& /*fout*/) const {};

    virtual void PrintResetStats(ofstream& /*fout*/) const {};
};

#endif
