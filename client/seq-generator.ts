export default function* SeqGenerator(): IterableIterator<number> {
  let count = 0;
  for (; ; ) {
    yield ++count;
  }
}
